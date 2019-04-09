import reflector from 'js-function-reflector'

interface IPattern {
  [branch: string]: any
}
interface IParam {
  type: string,
  name: string,
  value?: any
}

const match = (value: string, pattern: IPattern) => {
  const hasKey = (key: string) => String(value) === key
  const matchingCase = Object.keys(pattern).find(hasKey)
  const defaultCase = '_'
  const hasDefault = pattern.hasOwnProperty(defaultCase)

  if (!matchingCase && !hasDefault) {
    throw new ReferenceError(`Match error for value: ${value}`)
  }

  return pattern[matchingCase || defaultCase]
}
const matchArray = (value: any[], pattern: any[]) => {
  let params = [...value]
  const matchingCase = pattern.find(fn => {
    const args: IParam[] = reflector(fn).params
    const hasSameLength = value.length === args.length
    const hasDefaultCase = args.length === 1 && args[0].name === '_'

    if (hasDefaultCase) return true

    if (hasSameLength) {
      // set a default value if the value is missing
      params = args.map((item: IParam, index: number) => {
        const element = params[index]
        return element || item.value
      })

      return true
    }

    return false
  })

  if (typeof matchingCase !== 'function') {
    throw new ReferenceError(`Match error for value: ${JSON.stringify(value)}`)
  }

  return matchingCase(...params)
}

const lazyMatch = (pattern: IPattern) => (value: string) => match(value, pattern)

export { lazyMatch, matchArray }
export default match
