# Match values

Apply pattern matching on values

Table of Contents
=================

* [Getting started](#getting-started)
* [Usage](#usage)
   * [Match a pattern to get a numberic value](#match-a-pattern-to-get-a-numberic-value)
   * [Match a pattern to get a function](#match-a-pattern-to-get-a-function)
   * [Match a pattern lazily (useful for function composition)](#match-a-pattern-lazily-useful-for-function-composition)

## Getting started

```bash
$ npm install match-values
```

## Usage

The result of each case could be anything: primitive values, objects, functions,...

### Match a pattern to get a numberic value

```js
import match from 'match-values'

const pattern = {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
}
const fontSize = match(fontStyle, pattern)
// fontStyle = 'title' => 16
// fontStyle = 'unknown' => 13
```

### Match a pattern to get a function

```js
import match from 'match-values'

const handleError = match(error, {
  NOT_FOUND: () => showErrorMessage('Page not found'),
  TIMEOUT: () => showErrorMessage('Page has timed out'),
  _: NOOP
})
handleError()
```

### Match a pattern lazily (useful for function composition)

```js
import { lazyMatch } from 'match-values'

const fontSizes = ['h1', 'h2', 'x'].map(lazyMatch(pattern))
// fontSizes = [20, 18, 13]
...
const getFinalFontSize = compose(
  size => size + 1,
  lazyMatch(pattern),
  font => font.size
)
getFinalFontSize({
  size: 'description'
}) // 15
```
