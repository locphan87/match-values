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
import { match, last } from 'match-values'

// 1. Object Pattern Matching (for literal values)
const httpStatus = match(200, {
  200: 'OK',
  404: 'Not Found',
  500: 'Server Error',
  [last]: 'Unknown Status' // Default case
})
// Returns: 'OK'

// 2. Conditional Pattern Matching (with functions)
const getGeneration = match(1995, [
  [(year) => year >= 1997, 'Gen Z'],
  [(year) => year >= 1981, 'Millennial'],
  [(year) => year >= 1965, 'Gen X'],
  [last, 'Boomer'] // Default case
])
// Returns: 'Millennial'
```

## Key Features

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

- `match<T, R>(value: T, pattern: ObjectPattern<R> | ConditionalPattern<T, R>): R`
  - Matches a value against a pattern and returns the result.
- `lazyMatch<T, R>(pattern: ObjectPattern<R> | ConditionalPattern<T, R>): (value: T) => R`
  - Creates a reusable function that has the pattern baked in.
- `matchCond<T, R>(value: T, pattern: ConditionalPattern<T, R>): R`
  - A standalone function for when you only need conditional matching.

### Special Exports

- `last`: A `symbol` used to define the default case in any pattern. Using a symbol prevents key collisions.

### Pattern Types

- **Object Pattern**: `Record<string | number, R> & { [last]?: R }`
  - A simple JavaScript object for matching literal `string` or `number` keys.
- **Conditional Pattern**: `Array<[Predicate<T> | typeof last, R]>`
  - An array of tuples, where the first item is a predicate function (`(value: T) => boolean`) and the second is the result.

## Code Coverage

[View Test Report](https://locphan87.github.io/match-values/)

## License

MIT

