// The default case - last branch of a pattern
const last = Symbol('last')

type SearchKey = any
type MatchingValue = any
type Predicate = (value: any) => boolean
export interface PatternO {
  [branch: string]: MatchingValue
}
export type PatternT = [Predicate | symbol, MatchingValue]

// Match literal values
const matchValue = (searchKey: string | number, pattern: PatternO) => {
  const cases = Object.keys(pattern)
  const lastIndex = cases.length - 1
  const hasCorrectCase = (key: string, index: number) => {
    if (String(searchKey) === key) return true
    if (key === '_') {
      if (index !== lastIndex) {
        throw new Error(`_ must be the last branch.`)
      }
      return true
    }
    return false
  }
  const matchingCase = cases.find(hasCorrectCase)

  if (!matchingCase) {
    throw new ReferenceError(`Match error for search key: ${searchKey}`)
  }

  return pattern[matchingCase]
}

// Match conditions
const matchCond = (searchKey: SearchKey, pattern: PatternT[]) => {
  const lastIndex = pattern.length - 1
  const hasCorrectCase = (_pattern: PatternT, index: number) => {
    if (!_pattern || !Array.isArray(_pattern) || _pattern.length !== 2) {
      throw new Error(
        `Invalid branch ${JSON.stringify(
          _pattern
        )}. Each branch must be an array of 2 items.`
      )
    }
    const [branch] = _pattern
    if (branch === last) {
      if (index !== lastIndex) {
        throw new Error(`_ must be the last branch.`)
      }
      return true
    }
    if (typeof branch !== 'function') {
      throw new Error(
        'The first element of normal branch must be a predicate function.'
      )
    }
    if (branch(searchKey) === true) return true

    return false
  }
  const matchingCase = pattern.find(hasCorrectCase)

  if (!matchingCase) {
    throw new ReferenceError(
      `Match error for search key: ${JSON.stringify(searchKey)}`
    )
  }

  return matchingCase[1]
}

// General matching
const match = (searchKey: SearchKey, pattern: PatternO | PatternT[]) => {
  if (Array.isArray(pattern)) {
    return matchCond(searchKey, pattern)
  }

  return matchValue(searchKey, pattern)
}

// Match lazily a pattern for function composition
const lazyMatch = (pattern: PatternO | PatternT[]) => (searchKey: SearchKey) =>
  match(searchKey, pattern)

export { match, matchCond, lazyMatch, last }
export default match
