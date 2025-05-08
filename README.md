# Match Values

![match-values workflow](https://github.com/locphan87/match-values/actions/workflows/node.yml/badge.svg)

A lightweight JavaScript library that makes pattern matching simple and fun! 🎯

## Installation

```bash
npm install match-values
```

## Quick Start

Match Values provides a simple way to handle conditional logic using pattern matching. Think of it as a super-powered switch statement that's more flexible and easier to read.

### Basic Usage

```ts
import { match } from 'match-values'

// Simple value matching
const getFontSize = match('h1', {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13  // Default case
})
// Returns: 20

// Function matching
const handleError = match('NOT_FOUND', {
  NOT_FOUND: () => 'Page not found',
  TIMEOUT: () => 'Request timed out',
  _: () => 'Unknown error'
})
// Returns: 'Page not found'
```

## Key Features

### 1. Simple Value Matching

```ts
import { match } from 'match-values'

const getStatus = match(user.status, {
  active: 'Welcome back!',
  pending: 'Please verify your email',
  blocked: 'Account suspended',
  _: 'Unknown status'
})
```

### 2. Function Matching

```ts
import { match } from 'match-values'

const processUser = match(user, {
  admin: () => showAdminDashboard(),
  moderator: () => showModeratorPanel(),
  _: () => showUserDashboard()
})
```

### 3. Conditional Matching

```ts
import { match, last } from 'match-values'

const getMembershipLevel = match(user, {
  [user => user.points < 100]: 'Bronze',
  [user => user.points >= 100 && user.points < 500]: 'Silver',
  [user => user.points >= 500]: 'Gold',
  [last]: 'Unknown'
})
```

### 4. Lazy Matching

Perfect for function composition and array operations:

```ts
import { lazyMatch } from 'match-values'

const pattern = {
  small: 12,
  medium: 16,
  large: 20,
  _: 14
}

// Use with arrays
const sizes = ['small', 'medium', 'large'].map(lazyMatch(pattern))
// Returns: [12, 16, 20]

// Use with function composition
const getFinalSize = compose(
  size => size + 2,
  lazyMatch(pattern),
  item => item.size
)({ size: 'medium' })
// Returns: 18
```

## API Reference

### Main Functions

- `match(value, pattern)`: Matches a value against a pattern and returns the result
- `lazyMatch(pattern)`: Creates a function that can be used for lazy matching
- `last`: Special value for the default case in conditional matching

### Pattern Syntax

- Literal values: `{ key: value }`
- Functions: `{ key: () => value }`
- Conditions: `{ [predicate]: value }`
- Default case: Use `_` or `last`

## Code Coverage

[View Test Report](https://locphan87.github.io/match-values/)

## License

MIT
