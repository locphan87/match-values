# Match values

![match-values workflow](https://github.com/locphan87/match-values/actions/workflows/node.yml/badge.svg)

Apply pattern matching in JavaScript

## Getting started

```bash
$ npm install match-values
```

## Usage

- Syntax: `match(searchKey, pattern)`
- It can match literal values or conditions (predicate functions)
- The default case must be the last branch of a pattern
  - `match`: use `'_'`
  - `matchCond`: use `last`

### Match a pattern to get a primitive value

```ts
import { match } from 'match-values'

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
import { match } from 'match-values'

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
import { match, last } from 'match-values'

const pattern = {
  [x => x < 4, 'Basic'],
  [x => x.rating === 4, 'Silver'],
  [x => x.rating >= 5, 'Gold'],
  [last, 'Unknown']
}
match({ name: 'John 1', rating: 5 }, pattern) // Gold
match({ name: 'John 2', rating: 4 }, pattern) // Silver
match({ name: 'John 3', rating: 1 }, pattern) // Basic
match({ name: 'John 4' }, pattern) // Unknown
```

## Code Coverage

[Test Report](https://locphan87.github.io/match-values/)

## Licensing

MIT
