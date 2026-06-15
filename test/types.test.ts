import {
  match,
  lazyMatch,
  pattern,
  withDefault,
  cond,
  last,
  type AllPatternValues,
  type MatchResult,
} from '../src/index';

// --- object patterns infer literal unions ---

const statusPattern = pattern({
  200: 'OK',
  404: 'Not Found',
  [last]: 'Unknown',
} as const);

const statusResult: AllPatternValues<typeof statusPattern> = match(200, statusPattern);
const literalStatus: 'OK' = match(200 as const, statusPattern);
const lazyStatus: 'OK' | 'Not Found' | 'Unknown' = lazyMatch(statusPattern)(404);
const narrowedLazy: MatchResult<typeof statusPattern, 200> = lazyMatch(statusPattern)(200 as const);

void statusResult;
void literalStatus;
void lazyStatus;
void narrowedLazy;

// --- withDefault avoids inline [last] ---

const colorPattern = withDefault({ active: 'green', pending: 'orange' } as const, 'grey');
const colorResult: 'green' | 'orange' | 'grey' = match('active', colorPattern);

void colorResult;

// --- conditional patterns infer result unions ---

const tierPattern = cond([
  [(points: number) => points >= 500, 'Gold'],
  [(points: number) => points >= 100, 'Silver'],
  [last, 'Bronze'],
] as const);

const tierResult: 'Gold' | 'Silver' | 'Bronze' = match(150, tierPattern);
const lazyTier: 'Gold' | 'Silver' | 'Bronze' = lazyMatch(tierPattern)(50);

void tierResult;
void lazyTier;
