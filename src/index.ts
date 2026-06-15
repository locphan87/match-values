/**
 * A symbol to represent the default ("catch-all") case in a pattern match.
 * Using a symbol prevents potential key collisions with string or number inputs.
 */
export const last = Symbol('last');

// --- TYPE UTILITIES ---

type OmitLastKey<P> = Omit<P, typeof last>;

/** Union of all possible return values from an object pattern. */
export type AllPatternValues<P> =
  | (keyof OmitLastKey<P> extends infer K ? (K extends keyof P ? P[K] : never) : never)
  | (typeof last extends keyof P ? P[typeof last] : never);

/** Result type for a specific search key against an object pattern. */
export type MatchResult<P, K> = K extends keyof OmitLastKey<P>
  ? P[K]
  : typeof last extends keyof P
    ? P[typeof last]
    : AllPatternValues<P>;

type CondBranch = readonly [unknown, unknown];

/** Infer the union of result types from a conditional pattern array. */
export type InferCondResult<P extends readonly CondBranch[]> = P[number][1];

type ObjectPatternInput = Record<string | number, unknown> & { [last]?: unknown };
type CondPatternInput = readonly CondBranch[];

// --- LEGACY TYPE DEFINITIONS (backward compatible) ---

/**
 * A pattern for matching against literal string or number values.
 * It's an object where keys are the values to match and values are the results.
 * @template R The return type of the match expression.
 */
export type ObjectPattern<R> = Record<string | number, R> & { [last]?: R };

/**
 * A predicate function that returns true for a match.
 * @template T The type of the value being checked.
 */
type Predicate<T> = (value: T) => boolean;

/**
 * A pattern for matching against a series of conditions (predicates).
 * It's an array of tuples, where each tuple is `[predicate, result]`.
 * The last tuple can be `[last, result]` for a default case.
 * @template T The type of the value being matched.
 * @template R The return type of the match expression.
 */
export type ConditionalPattern<T, R> = Array<[Predicate<T> | typeof last, R]>;

// --- PATTERN HELPERS ---

/**
 * Defines an object pattern with full literal type inference.
 * Use this when defining reusable patterns to avoid explicit generic annotations.
 *
 * @example
 * const status = pattern({ 200: 'OK', 404: 'Not Found', [last]: 'Unknown' } as const);
 * match(200, status); // 'OK' | 'Not Found' | 'Unknown'
 */
export function pattern<const P extends ObjectPatternInput>(p: P): P {
  return p;
}

/**
 * Adds a default case to an object pattern without using the `[last]` syntax inline.
 *
 * @example
 * const colors = withDefault({ active: 'green', pending: 'orange' } as const, 'grey');
 * match('active', colors); // 'green' | 'orange' | 'grey'
 */
export function withDefault<const P extends Record<string | number, unknown>, const D>(
  cases: P,
  defaultValue: D
): P & { [last]: D } {
  return { ...cases, [last]: defaultValue };
}

/**
 * Defines a conditional pattern with full literal type inference.
 *
 * @example
 * const tiers = cond([
 *   [(p) => p >= 500, 'Gold'],
 *   [(p) => p >= 100, 'Silver'],
 *   [last, 'Bronze'],
 * ] as const);
 */
export function cond<const P extends CondPatternInput>(branches: P): P {
  return branches;
}

// --- PRIVATE IMPLEMENTATION ---

/**
 * Matches a literal value against an object pattern.
 */
const matchValue = <T extends string | number>(
  searchKey: T,
  pattern: ObjectPatternInput
): unknown => {
  if (searchKey in pattern) {
    return (pattern as Record<string | number, unknown>)[searchKey];
  }

  if (last in pattern) {
    return pattern[last];
  }

  throw new ReferenceError(`Match error: No matching case for search key "${searchKey}"`);
};

/**
 * Matches a value against a series of conditional branches.
 */
const matchCondImpl = <T>(searchKey: T, pattern: CondPatternInput): unknown => {
  const lastIndex = pattern.length - 1;

  for (let i = 0; i < pattern.length; i++) {
    const currentBranch = pattern[i];

    if (!currentBranch || !Array.isArray(currentBranch) || currentBranch.length !== 2) {
      throw new Error(
        `Invalid branch: ${JSON.stringify(currentBranch)}. Each branch must be an array of 2 items.`
      );
    }

    const [predicate, value] = currentBranch;

    if (predicate === last) {
      if (i !== lastIndex) {
        throw new Error('The default branch (`last`) must be the final branch in the pattern.');
      }
      return value;
    }

    if (typeof predicate !== 'function') {
      throw new Error(
        'Invalid branch: The first element must be a predicate function or the `last` symbol.'
      );
    }

    if ((predicate as Predicate<T>)(searchKey)) {
      return value;
    }
  }

  throw new ReferenceError(
    `Match error: No matching case for search key ${JSON.stringify(searchKey)}`
  );
};

// --- PUBLIC API ---

/**
 * Selects a value by matching a search key against a set of cases.
 * Can be used for both literal and conditional matching.
 *
 * @example
 * // Literal matching with inferred return type
 * const status = pattern({ 200: 'OK', 404: 'Not Found', [last]: 'Unknown' } as const);
 * match(200, status); // 'OK' | 'Not Found' | 'Unknown'
 *
 * @example
 * // Conditional matching
 * match(15, [
 *   [(x) => x > 10, 'large'],
 *   [(x) => x <= 10, 'small'],
 * ]); // 'large' | 'small'
 *
 * @param searchKey The value to match against the pattern.
 * @param pattern The pattern, either an object for literal matching or an array for conditional matching.
 * @returns The value from the first matching case.
 */
export function match<
  const P extends ObjectPatternInput,
  const K extends string | number
>(searchKey: K, pattern: P): MatchResult<P, K>;
export function match<T, const P extends CondPatternInput>(
  searchKey: T,
  pattern: P
): InferCondResult<P>;
export function match<T>(
  searchKey: T,
  pattern: ObjectPatternInput | CondPatternInput
): unknown {
  if (Array.isArray(pattern)) {
    return matchCondImpl(searchKey, pattern);
  }
  return matchValue(searchKey as string | number, pattern as ObjectPatternInput);
}

/**
 * A curried version of `match`. Creates a new function that has the pattern "baked in".
 * Useful for function composition and creating reusable matching logic.
 *
 * @example
 * const status = pattern({ 200: 'OK', 404: 'Not Found', [last]: 'Unknown' } as const);
 * const getStatus = lazyMatch(status);
 * getStatus(404); // 'OK' | 'Not Found' | 'Unknown'
 *
 * @param pattern The pattern to use for matching.
 * @returns A new function that takes a searchKey and returns a matched value.
 */
export function lazyMatch<const P extends ObjectPatternInput>(
  pattern: P
): <K extends string | number>(searchKey: K) => MatchResult<P, K>;
export function lazyMatch<T, const P extends CondPatternInput>(
  pattern: P
): (searchKey: T) => InferCondResult<P>;
export function lazyMatch(pattern: ObjectPatternInput | CondPatternInput) {
  return (searchKey: unknown) => match(searchKey as never, pattern as never);
}

/**
 * Matches a value against a series of conditional branches.
 *
 * @param searchKey The value to match against the pattern.
 * @param pattern An array of `[predicate, result]` tuples.
 * @returns The value from the first matching branch.
 */
export function matchCond<T, const P extends CondPatternInput>(
  searchKey: T,
  pattern: P
): InferCondResult<P>;
export function matchCond<T, R>(searchKey: T, pattern: ConditionalPattern<T, R>): R;
export function matchCond<T>(
  searchKey: T,
  pattern: CondPatternInput | ConditionalPattern<T, unknown>
): unknown {
  return matchCondImpl(searchKey, pattern as CondPatternInput);
}

// Default export `match` for convenience.
export default match;
