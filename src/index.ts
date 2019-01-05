interface IPattern {
  [branch: string]: any
}

const match = (value: string, pattern: IPattern) => {
  const hasKey = (key: string) => String(value) === key
  const matchingCase = Object.keys(pattern).find(hasKey)
  const defaultCase = '_'
  const hasDefault = pattern.hasOwnProperty(defaultCase)

  if (!matchingCase && !hasDefault) {
    throw new Error(`Match error for value: ${value}`)
  }

  return pattern[matchingCase || defaultCase]
}

const lazyMatch = (pattern: IPattern) => (value: string) => match(value, pattern)

export { lazyMatch }
export default match
