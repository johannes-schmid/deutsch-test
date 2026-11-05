/**
 * The health score of `/admin/seo`: every page out of 10, the site out of 100.
 *
 * Plain JavaScript with a `.d.mts` next to it, because two readers must make exactly the same sum:
 * the page (live numbers) and `scripts/seo-agent/score.mjs` (the Friday snapshot, which writes the
 * weekly row in `seo-agent/data/history/health.json`). Two copies of a formula drift apart without
 * anyone noticing, and then the line over time is a line between two definitions.
 *
 * The score starts at 10 and every deduction is a `factor` with an English label, so the page can
 * say why a page has a 6. Unknown is not zero: without live numbers visibility doesn't count, and a
 * page without search demand isn't punished because Google doesn't show it.
 *
 * `demand` is the page's impressions in the previous 28-day window (this site has no "before the
 * drop" baseline like inburgering's). So visibility compares this window with the one before.
 */

const LENGTH_ISSUE = /^(title|description) (\d+) chars$/;

const VERDICT = {
  healthy: { delta: 0, label: null },
  watch: { delta: -2, label: 'Thin page we are watching' },
  improve: { delta: -3, label: 'Needs a rewrite' },
  consolidate: { delta: -5, label: 'Duplicates a stronger page' },
  remove: { delta: -6, label: 'Should leave Google’s index' },
};

/** What Google would show in 28 days if the page stayed at last window's level. */
export function expectedImpressions(demand) {
  return demand;
}

export function pageScore(p) {
  const factors = [];
  const v = VERDICT[p.verdict];
  if (v.delta) factors.push({ key: 'verdict', delta: v.delta, label: v.label });

  const expected = expectedImpressions(p.demand);
  if (p.now && expected >= 5) {
    let search = 0;
    const ratio = p.now.impressions / expected;
    const pctLabel = `${Math.round(ratio * 100)}%`;
    const vis = ratio < 0.25 ? -3 : ratio < 0.6 ? -2 : ratio < 0.9 ? -1 : 0;
    if (vis) {
      factors.push({ key: 'visibility', delta: vis, label: `Google shows it at ${pctLabel} of the 28 days before` });
      search += vis;
    }
    const pos = p.now.position;
    if (p.now.impressions > 0 && pos !== null) {
      const d = pos > 20 ? -2 : pos > 10 ? -1 : 0;
      const room = Math.max(-4 - search, d);
      if (room) factors.push({ key: 'position', delta: room, label: `Average position ${Math.round(pos)}${pos > 20 ? ', beyond page 2' : ', on page 2'}` });
    } else if (p.now.impressions === 0 && search > -4) {
      factors.push({ key: 'position', delta: Math.max(-4 - search, -1), label: 'Not shown for any query' });
    }
  } else if (p.now && p.now.impressions > 0 && p.now.position !== null) {
    // A page with fresh demand and no history: only its position counts.
    const pos = p.now.position;
    const d = pos > 20 ? -2 : pos > 10 ? -1 : 0;
    if (d) factors.push({ key: 'position', delta: d, label: `Average position ${Math.round(pos)}${pos > 20 ? ', beyond page 2' : ', on page 2'}` });
  }

  const lengths = p.issues.filter(i => LENGTH_ISSUE.test(i));
  const errors = p.issues.filter(i => !LENGTH_ISSUE.test(i));
  if (errors.length) factors.push({ key: 'technical', delta: -3, label: `Technical error: ${errors.join(', ')}` });
  if (lengths.length) {
    const [, what, n] = LENGTH_ISSUE.exec(lengths[0]);
    factors.push({
      key: 'snippet',
      delta: -1,
      label: `${what === 'title' ? 'Title' : 'Meta description'} is ${n} characters (${what === 'title' ? 'max 60' : '140–160'})`,
    });
  }

  const score = Math.max(1, Math.min(10, 10 + factors.reduce((s, f) => s + f.delta, 0)));
  return { score, factors };
}

/** A page counts by its search demand, with a small floor so a page without demand doesn't vanish. */
export function pageWeight(p) {
  return Math.max(expectedImpressions(p.demand), p.now?.impressions ?? 0) + 3;
}

export function rollup(pages) {
  let sum = 0;
  let weight = 0;
  const bySection = {};
  for (const p of pages) {
    const w = pageWeight(p);
    const s = pageScore(p).score;
    sum += s * w;
    weight += w;
    const b = (bySection[p.section] ??= { sum: 0, weight: 0 });
    b.sum += s * w;
    b.weight += w;
  }
  const sections = {};
  for (const [k, b] of Object.entries(bySection)) sections[k] = Math.round((b.sum / b.weight) * 10) / 10;
  return { site: weight ? Math.round((sum / weight) * 10) : null, sections };
}

/** One row per ISO week; a second run in the same week replaces the first. */
export function upsertHistory(rows, row) {
  return [...rows.filter(r => r.week !== row.week), row].sort((a, b) => a.week.localeCompare(b.week));
}
