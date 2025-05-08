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
  const cases = Object.entries(pattern)
  const lastIndex = cases.length - 1

  for (let i = 0; i < cases.length; i++) {
    const [key, value] = cases[i]
    
    if (String(searchKey) === key) {
      return value
    }
    
    if (key === '_') {
      if (i !== lastIndex) {
        throw new Error('_ must be the last branch.')
      }
      return value
    }
  }

  throw new ReferenceError(`Match error for search key: ${searchKey}`)
}

// Match conditions
const matchCond = (searchKey: SearchKey, pattern: PatternT[]) => {
  const lastIndex = pattern.length - 1

  for (let i = 0; i < pattern.length; i++) {
    const currentPattern = pattern[i]

    // Validate pattern structure
    if (!currentPattern || !Array.isArray(currentPattern) || currentPattern.length !== 2) {
      throw new Error(
        `Invalid branch ${JSON.stringify(currentPattern)}. Each branch must be an array of 2 items.`
      )
    }

    const [predicate, value] = currentPattern

    // Handle last (default) case
    if (predicate === last) {
      if (i !== lastIndex) {
        throw new Error('_ must be the last branch.')
      }
      return value
    }

    // Validate predicate
    if (typeof predicate !== 'function') {
      throw new Error('The first element of normal branch must be a predicate function.')
    }

    // Check if predicate matches
    if (predicate(searchKey) === true) {
      return value
    }
  }

  throw new ReferenceError(`Match error for search key: ${JSON.stringify(searchKey)}`)
}

// General matching
const match = (searchKey: SearchKey, pattern: PatternO | PatternT[]) => {
  return Array.isArray(pattern) 
    ? matchCond(searchKey, pattern)
    : matchValue(searchKey, pattern)
}

// Match lazily a pattern for function composition
const lazyMatch = (pattern: PatternO | PatternT[]) => (searchKey: SearchKey) =>
  match(searchKey, pattern)

export { match, matchCond, lazyMatch, last }
export default match
