#!/usr/bin/env node
/**
 * IndexNow: tells Bing (and through it Yandex, Seznam, Naver) about new or changed URLs.
 *
 *   node scripts/seo-agent/indexnow.mjs --changed --state <file>  # URLs new in the sitemap or with a newer <lastmod>
 *   node scripts/seo-agent/indexnow.mjs --all --state <file>      # the whole sitemap, once
 *   node scripts/seo-agent/indexnow.mjs /blog/x /uk/blog/x        # by hand, after a real change
 *   ... --dry-run                                                 # print, send nothing
 *
 * The key is public: `public/<KEY>.txt` at the root proves we own the host, so it is not a secret.
 *
 * IndexNow is for changed URLs; resending everything on every deploy earns 429s or gets ignored.
 * Change signals: a URL new in the sitemap, or a newer <lastmod> (only blog posts carry one).
 * Without a state file `--changed` only records a baseline and sends nothing, so an expired cache
 * never silently resubmits the whole sitemap.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const HOST = 'deutschtest-ueben.de';
const ORIGIN = `https://${HOST}`;
const KEY = '04040a59e9e49bdcafa194b6b8babf33';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_PER_REQUEST = 10_000;

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const value = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const statePath = value('state');
const dryRun = has('dry-run');
const manual = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--state');

/** { url: lastmod | '' } from the live sitemap. */
async function sitemap() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap: HTTP ${res.status}`);
  const xml = await res.text();
  const out = {};
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
    if (loc) out[loc] = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() ?? '';
  }
  return out;
}

async function submit(urls) {
  if (urls.length === 0) { console.log('Nothing to submit.'); return; }
  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const urlList = urls.slice(i, i + MAX_PER_REQUEST);
    if (dryRun) { console.log(`[dry-run] ${urlList.length} URLs:\n${urlList.join('\n')}`); continue; }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
    if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow refused (${res.status}): ${await res.text()}`);
  }
}

async function main() {
  const keyFile = await fetch(`${ORIGIN}/${KEY}.txt`).catch(() => null);
  if (!keyFile?.ok || (await keyFile.text()).trim() !== KEY) {
    const msg = `Key file ${ORIGIN}/${KEY}.txt is not live (or wrong)`;
    if (!dryRun) throw new Error(msg);
    console.warn(`[dry-run] ${msg}`);
  }

  if (manual.length > 0) {
    await submit(manual.map((u) => (u.startsWith('http') ? u : `${ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`)));
    return;
  }

  const current = await sitemap();
  if (has('all')) {
    await submit(Object.keys(current));
  } else if (has('changed')) {
    if (!statePath) throw new Error('--changed needs --state <file>');
    if (!existsSync(statePath)) {
      console.log(`No state: recorded a baseline of ${Object.keys(current).length} URLs, sent nothing.`);
    } else {
      const seen = JSON.parse(readFileSync(statePath, 'utf8'));
      await submit(Object.keys(current).filter((u) => !(u in seen) || current[u] !== seen[u]));
    }
  } else {
    throw new Error('Pass --all, --changed --state <file>, or one or more URLs');
  }

  if (statePath && !dryRun) writeFileSync(statePath, JSON.stringify(current, null, 2));
}

main().catch((err) => { console.error(err.message); process.exit(1); });
