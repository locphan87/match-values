# Match values

Apply pattern matching in JavaScript

# Table of Contents

- [Match values](#match-values)
- [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Usage](#usage)
    - [Match a pattern to get a primitive value](#match-a-pattern-to-get-a-primitive-value)
    - [Match a pattern to get a function](#match-a-pattern-to-get-a-function)
  - [Advanced Usage](#advanced-usage)
    - [Match a pattern lazily (useful for function composition)](#match-a-pattern-lazily-useful-for-function-composition)
    - [Match conditions](#match-conditions)
  - [Licensing](#licensing)

## Getting started

```bash
$ npm install match-values
```

## Usage

- Syntax: `match(variable, pattern)`
- It can match values and conditions
- The matching value of each case could be anything: primitive values, objects, functions,...
- Use `_` for the default case. And it must be the last branch of a pattern

### Match a pattern to get a primitive value

```ts
import match from 'match-values'

const pattern = {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13
}
match('h1', pattern) // 20
match('h2', pattern) // 18
match('title', pattern) // 16
match('description', pattern) // 14
match('anything', pattern) // 13
```

### Match a pattern to get a function

```ts
import match from 'match-values'

const handleError = match(error, {
  NOT_FOUND: () => showErrorMessage('Page not found'),
  TIMEOUT: () => showErrorMessage('Page has timed out'),
  _: NOOP
})
handleError()
```

## Advanced Usage

### Match a pattern lazily (useful for function composition)

```ts
import { lazyMatch } from 'match-values'

const pattern = {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13
}

const fontSizes = ['h1', 'h2', 'x'].map(lazyMatch(pattern)) // [20, 18, 13]
const getFinalFontSize = compose(
  (size) => size + 1,
  lazyMatch(pattern),
  (font) => font.size
)({
  size: 'description'
}) // 15
```

### Match conditions

```ts
const pattern = {
  [x => x > 5, 'smaller'],
  [x => x === 5, 'correct'],
  [_, 'greater']
}
match(8, pattern) // smaller
match(5, pattern) // correct
match(1, pattern) // greater
```

## Licensing

MIT
