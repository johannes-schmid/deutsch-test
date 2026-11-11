/**
 * Indexing: per page in `seo-agent/pages.json` the result of Search Console URL Inspection ("Submitted and
 * indexed", "Crawled - currently not indexed", ...). Feeds the Index column and the "Not in Google" filter
 * on `/admin/seo`.
 *
 * Only pages that should be indexed: a page with verdict `remove` leaves the index on purpose. The API allows
 * 2,000 inspections per day per property; this is under 200 a week.
 *
 *   node scripts/seo-agent/collect.mjs --only indexing
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { google } from 'googleapis';
import { SEO_DIR, mapLimit, skipped } from './lib/io.mjs';

function auth() {
  const raw = process.env.GSC_SA_JSON;
  if (!raw) return null;
  const creds = JSON.parse(raw.trim().replace(/^'([\s\S]*)'$/, '$1'));
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

export async function collectIndexing(config) {
  const jwt = auth();
  if (!jwt) return skipped('GSC_SA_JSON missing');
  const site = config.sites.deutschtest;
  const origin = `https://${site.domain}`;
  const triage = JSON.parse(readFileSync(join(SEO_DIR, 'pages.json'), 'utf8'));
  const paths = triage.pages.filter(p => p.verdict !== 'remove').map(p => p.path);
  const sc = google.searchconsole({ version: 'v1', auth: jwt });

  const errors = [];
  const results = await mapLimit(paths, 4, async path => {
    try {
      const { data } = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: encodeURI(`${origin}${path}`), siteUrl: site.gsc_property },
      });
      const r = data.inspectionResult?.indexStatusResult ?? {};
      return [path, { verdict: r.verdict ?? 'UNKNOWN', coverage: r.coverageState ?? 'Unknown', lastCrawl: r.lastCrawlTime ?? null }];
    } catch (err) {
      errors.push(`${path}: ${err.message}`);
      return null;
    }
  });

  return { property: site.gsc_property, checked: paths.length, pages: Object.fromEntries(results.filter(Boolean)), errors: errors.slice(0, 20) };
}
