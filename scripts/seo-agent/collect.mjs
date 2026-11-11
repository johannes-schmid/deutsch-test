#!/usr/bin/env node
/**
 * The Friday-evening run: every source into seo-agent/data/<ISO-week>/*.json.
 *
 *   node scripts/seo-agent/collect.mjs                 # this week, all sources
 *   node scripts/seo-agent/collect.mjs --week 2026-W45 # another week folder
 *   node scripts/seo-agent/collect.mjs --only gsc,health
 *   node scripts/seo-agent/collect.mjs --backfill      # 16 months of GSC daily totals, once
 *   node scripts/seo-agent/collect.mjs --force-geo     # GEO in an odd week too
 *
 * A source without a key writes `{ skipped }` and the run goes on; the agent reads that as
 * "unknown", never as zero. Deterministic and without judgement: the judgement is the Saturday run.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { isoWeek, isEvenWeek } from './lib/dates.mjs';
import { readConfig, writeSnapshot, SEO_DIR } from './lib/io.mjs';
import { collectGsc, backfillGsc } from './gsc.mjs';
import { collectBing } from './bing.mjs';
import { collectHealth } from './health.mjs';
import { collectCompetitors } from './competitors.mjs';
import { collectGeo } from './geo.mjs';
import { collectIndexing } from './indexing.mjs';
import { collectBacklinks } from './backlinks.mjs';

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };

const config = readConfig();
const week = typeof flag('week') === 'string' ? flag('week') : isoWeek();
const only = typeof flag('only') === 'string' ? flag('only').split(',') : null;
const geoDue = isEvenWeek(week) || flag('force-geo') === true;

const SOURCES = {
  gsc: () => collectGsc(config),
  bing: () => collectBing(config),
  health: () => collectHealth(config),
  competitors: () => collectCompetitors(config, { week }),
  indexing: () => collectIndexing(config),
  backlinks: () => collectBacklinks(config),
  geo: () => (geoDue ? collectGeo(config) : Promise.resolve({ skipped: `odd week (${week}); GEO runs in even weeks` })),
};

if (flag('backfill') === true) {
  const dir = join(SEO_DIR, 'data', 'history');
  mkdirSync(dir, { recursive: true });
  const data = await backfillGsc(config);
  writeFileSync(join(dir, `gsc-daily-${new Date().toISOString().slice(0, 10)}.json`), JSON.stringify(data, null, 2) + '\n');
  console.log('backfill → seo-agent/data/history');
}

const summary = {};
for (const [name, run] of Object.entries(SOURCES)) {
  if (only && !only.includes(name)) continue;
  const t0 = Date.now();
  try {
    const payload = await run();
    writeSnapshot(week, name, payload);
    summary[name] = payload.skipped ? `skipped: ${payload.skipped}` : `ok (${Math.round((Date.now() - t0) / 1000)}s)`;
  } catch (err) {
    writeSnapshot(week, name, { error: err.message });
    summary[name] = `error: ${err.message}`;
  }
  console.log(`${name.padEnd(12)} ${summary[name]}`);
}
writeSnapshot(week, 'index', { sources: summary, geo_due: geoDue });
