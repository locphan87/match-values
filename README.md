# Match values

Apply pattern matching on values

Table of Contents
=================

* [Getting started](#getting-started)
* [Usage](#usage)
   * [Match a pattern to get a numberic value](#match-a-pattern-to-get-a-numberic-value)
   * [Match a pattern to get a function](#match-a-pattern-to-get-a-function)
* [Advanced Usage](#advanced-usage)
   * [Match a pattern lazily (useful for function composition)](#match-a-pattern-lazily-useful-for-function-composition)
   * [Match an array](#match-an-array)
* [Licensing](#licensing)


## Getting started

```bash
$ npm install match-values
```

## Usage

- Syntax: `match(valueToMatch, pattern)`
- It can match literal values (string, number) or structural values (array, object)
- The matching value of each case could be anything: primitive values, objects, functions,...
- Use `'_'` for the default case. And it must be the last branch of a pattern

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

// EXAMPLE 1
const fontSizes = ['h1', 'h2', 'x'].map(lazyMatch(pattern))
// fontSizes = [20, 18, 13]

// EXAMPLE 2
const getFinalFontSize = compose(
  size => size + 1,
  lazyMatch(pattern),
  font => font.size
)
getFinalFontSize({
  size: 'description'
}) // 15
```

### Match an array

```ts
import { match } from 'match-values'

const inputs = [[1], [1, 2], [1, 2, 3]]
const pattern = [
  [inputs[0], 'x1'],
  [inputs[1], 'x2'],
  [inputs[2], 'x3'],
  ['_', 'default']
]
match([1], pattern) // 'x1'
match([1, 2], pattern) // 'x2'
match([1, 2, 3], pattern) // 'x3'
match([], pattern) // 'default'
```

### Match an object

```ts
import { match } from 'match-values'

const inputs = [{ a: 1 }, { a: 1, b: 2 }, { a: 1, b: 2, c: 3 }]
const pattern = [
  [inputs[0], 'y1'],
  [inputs[1], 'y2'],
  [inputs[2], 'y3'],
  ['_', 'default']
]
match({ a: 1 }, pattern) // 'y1'
match({ a: 1, b: 2 }, pattern) // 'y2'
match({ a: 1, b: 2, c: 3 }, pattern) // 'y3'
match({}, pattern) // 'default'
```

## Licensing

MIT
