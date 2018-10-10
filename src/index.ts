interface IPattern {
  [branch: string]: any
}

const match = (value: string, pattern: IPattern) => {
  const hasKey = (key: string) => String(value) === key
  const matchingCase = Object.keys(pattern).find(hasKey) || '_'
  const result = pattern[matchingCase]

  if (result === null || (typeof result === 'undefined')) {
    throw new Error('Match error')
  }

  return result
}

const lazyMatch = (pattern: IPattern) => (value: string) => match(value, pattern)

export { lazyMatch }
export default match
