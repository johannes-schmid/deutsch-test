export type Verdict = 'healthy' | 'watch' | 'improve' | 'consolidate' | 'remove';

export type ScoreFactor = { key: 'verdict' | 'visibility' | 'position' | 'technical' | 'snippet'; delta: number; label: string };

export type ScoreInput = {
  path: string;
  section: string;
  verdict: Verdict;
  /** Impressions in the previous 28-day window. */
  demand: number;
  /** `null` = unknown (no Search Console data). */
  now: { impressions: number; position: number | null } | null;
  issues: string[];
};

export type HistoryRow = {
  week: string;
  date: string;
  site: number | null;
  sections: Record<string, number>;
  pages: number;
  gsc: boolean;
  triage: string;
};

export function expectedImpressions(demand: number): number;
export function pageScore(p: ScoreInput): { score: number; factors: ScoreFactor[] };
export function pageWeight(p: ScoreInput): number;
export function rollup(pages: ScoreInput[]): { site: number | null; sections: Record<string, number> };
export function upsertHistory(rows: HistoryRow[], row: HistoryRow): HistoryRow[];
