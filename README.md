# Match Values

[![match-values workflow](https://github.com/locphan87/match-values/actions/workflows/node.yml/badge.svg)](https://github.com/locphan87/match-values/actions/workflows/node.yml)

A lightweight, fully-typed TypeScript library that makes pattern matching simple, safe, and fun! 🎯

## Installation

```bash
npm install match-values
```

## Quick Start

`match-values` provides a simple and powerful way to handle conditional logic using pattern matching. Think of it as a super-powered `switch` statement that's more flexible, readable, and completely type-safe.

### Basic Usage

```ts
import { match, pattern, cond, withDefault, last } from 'match-values'

// 1. Object Pattern Matching (for literal values)
const httpStatusPattern = pattern({
  200: 'OK',
  404: 'Not Found',
  500: 'Server Error',
  [last]: 'Unknown Status', // Default case
} as const)

const httpStatus = match(200, httpStatusPattern)
// Returns: 'OK' (typed as 'OK' | 'Not Found' | 'Server Error' | 'Unknown Status')

// Or use withDefault to skip inline [last]:
const colorPattern = withDefault({ active: 'green', pending: 'orange' } as const, 'grey')

// 2. Conditional Pattern Matching (with functions)
const generationPattern = cond([
  [(year) => year >= 1997, 'Gen Z'],
  [(year) => year >= 1981, 'Millennial'],
  [(year) => year >= 1965, 'Gen X'],
  [last, 'Boomer'], // Default case
] as const)

const getGeneration = match(1995, generationPattern)
// Returns: 'Millennial'
```

## Key Features

### 0. Pattern Helpers (Recommended)

Define patterns once with full type inference — no manual generics needed:

```ts
import { pattern, withDefault, cond, match, lazyMatch, last } from 'match-values'

// Object pattern — return type is inferred as a literal union
const status = pattern({ 200: 'OK', 404: 'Not Found', [last]: 'Unknown' } as const)
match(200, status) // 'OK' | 'Not Found' | 'Unknown'
match(200 as const, status) // 'OK' (narrowed when key is a literal)

// Default case without [last] syntax
const colors = withDefault({ active: 'green', pending: 'orange' } as const, 'grey')

// Conditional pattern — result union inferred from branches
const tiers = cond([
  [(p) => p >= 500, 'Gold'],
  [(p) => p >= 100, 'Silver'],
  [last, 'Bronze'],
] as const)

// Reusable matcher with pattern-first typing
const getStatus = lazyMatch(status)
getStatus(404) // 'OK' | 'Not Found' | 'Unknown'
```

Use `as const` on pattern literals for the narrowest inferred types.

### 1. Object Pattern Matching

Use plain objects to match against `string` or `number` keys. This is the most efficient way to handle a fixed set of literal values.

```ts
import { match, last } from 'match-values'

const getStatusColor = match(user.status, {
  active: 'green',
  pending: 'orange',
  blocked: 'red',
  [last]: 'grey'
})
```

### 2. Conditional Pattern Matching

Use an array of `[predicate, value]` tuples for more complex logic. The first predicate to return `true` wins.

```ts
import { match, last } from 'match-values'

const getMembershipLevel = match(user.points, [
  [(points) => points >= 500, 'Gold'],
  [(points) => points >= 100, 'Silver'],
  [(points) => points < 100, 'Bronze']
  // No default case needed if all possibilities are covered
])
```

### 3. Lazy Matching

Perfect for function composition and processing arrays. `lazyMatch` creates a reusable function with the pattern "baked in."

```ts
import { lazyMatch, last } from 'match-values'

const sizePattern = {
  small: 12,
  medium: 16,
  large: 20,
  [last]: 14 // Default size
}

// Use with arrays
const sizes = ['small', 'medium', 'extra-large'].map(lazyMatch(sizePattern))
// Returns: [12, 16, 14]

// Use in a function pipeline
const getFinalSize = compose(
  (size) => size + 2, // Add padding
  lazyMatch(sizePattern),
  (item) => item.size
)({ size: 'medium' })
// Returns: 18
```

## API Reference

### Main Functions

- `match(value, pattern)`
  - Matches a value against a pattern and returns the result. Return types are inferred from the pattern.
- `lazyMatch(pattern)`
  - Creates a reusable function that has the pattern baked in. For object patterns, narrows the return type when the key is a literal.
- `matchCond(value, pattern)`
  - A standalone function for when you only need conditional matching.

### Pattern Helpers

- `pattern(object)` — Define an object pattern with literal type inference.
- `withDefault(cases, defaultValue)` — Add a default case without inline `[last]`.
- `cond(branches)` — Define a conditional pattern with inferred result unions.

### Special Exports

- `last`: A `symbol` used to define the default case in any pattern. Using a symbol prevents key collisions.

### Utility Types

- `AllPatternValues<P>` — Union of all values in an object pattern.
- `MatchResult<P, K>` — Result type for a specific key against an object pattern.
- `InferCondResult<P>` — Union of all result values in a conditional pattern.

### Pattern Types

- **Object Pattern**: `Record<string | number, R> & { [last]?: R }`
  - A simple JavaScript object for matching literal `string` or `number` keys.
- **Conditional Pattern**: `Array<[Predicate<T> | typeof last, R]>`
  - An array of tuples, where the first item is a predicate function (`(value: T) => boolean`) and the second is the result.

## Code Coverage

[View Test Report](https://locphan87.github.io/match-values/)

## License

MIT

