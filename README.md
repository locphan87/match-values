# Match values

Apply pattern matching on values

## Getting started

```bash
$ npm install match-values
```

## Usage

The result of each case could be anything: primitive values, objects, functions,...

```js
import match from 'match-values'

const fontSize = match(fontStyle)({
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
})
// fontStyle = 'title' => 16
// fontStyle = 'unknown' => 13
```

```js
import match from 'match-values'

const handleError = match(error)({
  NOT_FOUND: () => showErrorMessage('Page not found'),
  TIMEOUT: () => showErrorMessage('Page has timed out'),
  _: NOOP
})
handleError()
```
