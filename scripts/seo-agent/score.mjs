#!/usr/bin/env node
/**
 * The weekly health score: one row in seo-agent/data/history/health.json.
 *
 *   node scripts/seo-agent/score.mjs                  # the latest snapshot
 *   node scripts/seo-agent/score.mjs --week 2026-W45  # an older week (backfill)
 *
 * Runs in the Friday job right after collect.mjs. The sum is the same as on /admin/seo
 * (`lib/admin/seo-score.mjs`), only with the snapshot instead of live numbers. Without a Search
 * Console snapshot it computes without visibility and the row says so (`gsc: false`): unknown, never zero.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SEO_DIR, readSnapshot } from './lib/io.mjs';
import { rollup, upsertHistory } from '../../lib/admin/seo-score.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--week');
const weeks = readdirSync(join(SEO_DIR, 'data')).filter(d => /^\d{4}-W\d{2}$/.test(d)).sort();
const week = i >= 0 ? args[i + 1] : weeks.at(-1);
if (!weeks.includes(week)) throw new Error(`no snapshot for ${week}`);

const triageFile = join(SEO_DIR, 'pages.json');
if (!existsSync(triageFile)) throw new Error('no seo-agent/pages.json: run node scripts/seo-agent/pages.mjs first');
const triage = JSON.parse(readFileSync(triageFile, 'utf8'));
const gsc = readSnapshot(week, 'gsc')?.sites?.deutschtest;
const health = readSnapshot(week, 'health')?.sites?.deutschtest;
const toPath = url => decodeURI(url.replace(/^https?:\/\/[^/]+/, '')) || '/';

const gscOk = !!gsc?.current?.page;
const now = new Map((gsc?.current?.page ?? []).map(r => [toPath(r.keys[0]), { impressions: r.impressions, position: r.position }]));
const before = new Map((gsc?.previous?.page ?? []).map(r => [toPath(r.keys[0]), r.impressions]));
const issues = new Map(Object.entries(health?.problems ?? {}).map(([url, list]) => [toPath(url), list]));

const pages = triage.pages.map(p => ({
  path: p.path,
  section: p.section,
  verdict: p.verdict,
  demand: gscOk ? before.get(p.path) ?? 0 : p.demand,
  now: gscOk ? now.get(p.path) ?? { impressions: 0, position: null } : null,
  issues: issues.get(p.path) ?? [],
}));
const { site, sections } = rollup(pages);

const dir = join(SEO_DIR, 'data', 'history');
mkdirSync(dir, { recursive: true });
const file = join(dir, 'health.json');
const prev = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { rows: [] };
const row = {
  week,
  date: (gsc?.windows?.current?.end ?? new Date().toISOString()).slice(0, 10),
  site,
  sections,
  pages: pages.length,
  gsc: gscOk,
  triage: triage.updated,
};
writeFileSync(file, JSON.stringify({
  $comment: 'Written by scripts/seo-agent/score.mjs. One row per week; the sum lives in lib/admin/seo-score.mjs.',
  rows: upsertHistory(prev.rows, row),
}, null, 2) + '\n');
console.log(`${week}: ${site}/100`, sections);
