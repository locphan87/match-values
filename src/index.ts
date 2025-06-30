/**
 * A symbol to represent the default ("catch-all") case in a pattern match.
 * Using a symbol prevents potential key collisions with string or number inputs.
 */
export const last = Symbol('last');

// --- TYPE DEFINITIONS ---

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

// --- PRIVATE IMPLEMENTATION ---

/**
 * Matches a literal value against an object pattern.
 */
const matchValue = <T extends string | number, R>(
  searchKey: T,
  pattern: ObjectPattern<R>
): R => {
  // The `as any` is a pragmatic concession to TypeScript's difficulty in
  // precisely typing an object with both arbitrary string/number keys and a symbol key.
  // The `in` operator provides the runtime safety.
  if (searchKey in pattern) {
    return (pattern as any)[searchKey];
  }

  if (last in pattern) {
    return pattern[last] as R;
  }

  throw new ReferenceError(`Match error: No matching case for search key "${searchKey}"`);
};

/**
 * Matches a value against a series of conditional branches.
 */
const matchCond = <T, R>(
  searchKey: T,
  pattern: ConditionalPattern<T, R>
): R => {
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

    if (predicate(searchKey)) {
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
 * // Literal matching
 * match(200, { 200: 'OK', 404: 'Not Found', [last]: 'Unknown' }); // 'OK'
 *
 * @example
 * // Conditional matching
 * match(15, [
 *   [(x) => x > 10, 'large'],
 *   [(x) => x <= 10, 'small'],
 * ]); // 'large'
 *
 * @param searchKey The value to match against the pattern.
 * @param pattern The pattern, either an object for literal matching or an array for conditional matching.
 * @returns The value from the first matching case.
 */
export function match<T extends string | number, R>(searchKey: T, pattern: ObjectPattern<R>): R;
export function match<T, R>(searchKey: T, pattern: ConditionalPattern<T, R>): R;
export function match<T, R>(
  searchKey: T,
  pattern: ObjectPattern<R> | ConditionalPattern<T, R>
): R {
  if (Array.isArray(pattern)) {
    return matchCond(searchKey, pattern as ConditionalPattern<T, R>);
  }
  // TypeScript needs a little help with the type assertion here due to the overloads.
  return matchValue(searchKey as string | number, pattern as ObjectPattern<R>);
}

/**
 * A curried version of `match`. Creates a new function that has the pattern "baked in".
 * Useful for function composition and creating reusable matching logic.
 *
 * @example
 * const getStatus = lazyMatch({ 200: 'OK', 404: 'Not Found', [last]: 'Unknown' });
 * getStatus(404); // 'Not Found'
 *
 * @param pattern The pattern to use for matching.
 * @returns A new function that takes a searchKey and returns a matched value.
 */
export function lazyMatch<T extends string | number, R>(pattern: ObjectPattern<R>): (searchKey: T) => R;
export function lazyMatch<T, R>(pattern: ConditionalPattern<T, R>): (searchKey: T) => R;
export function lazyMatch<T, R>(
  pattern: ObjectPattern<R> | ConditionalPattern<T, R>
) {
  // The `as any` here is acceptable because the public-facing overloads
  // provide the necessary type safety for consumers of the function.
  return (searchKey: T) => match(searchKey as any, pattern as any);
}

// Export `matchCond` separately for users who may want only conditional matching.
export { matchCond };

// Default export `match` for convenience.
export default match;