// an object of branch and matching value
interface PatternO {
  [branch: string]: any
}
// a 2-tuple of branch and matching value
type PatternT = [any, any]

// The default case - last branch of a pattern
const _ = Symbol('else')

// Match literal values
const matchValue = (value: string | number, pattern: PatternO) => {
  const cases = Object.keys(pattern)
  const lastIndex = cases.length - 1
  const hasCorrectCase = (key: string, index: number) => {
    if (String(value) === key) return true
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
    throw new ReferenceError(`Match error for value: ${value}`)
  }

  return pattern[matchingCase]
}

// Match conditions
const matchCond = (value: any, pattern: any[]) => {
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
    if (branch === _) {
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
    if (branch(value) === true) return true

    return false
  }
  const matchingCase = pattern.find(hasCorrectCase)

  if (!matchingCase) {
    throw new ReferenceError(`Match error for value: ${JSON.stringify(value)}`)
  }

  return matchingCase[1]
}

// General matching
const match = (value: any, pattern: any) => {
  if (Array.isArray(pattern)) {
    return matchCond(value, pattern)
  }

  return matchValue(value, pattern)
}

// Match lazily a pattern for function composition
const lazyMatch = (pattern: any) => (value: any) => match(value, pattern)

export { match, matchCond, lazyMatch, PatternT, _ }
export default match
