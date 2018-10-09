interface ICase {
  [branch: string]: any
}

const match = (value: string) => (cases: ICase) => {
  const hasKey = (key: string) => String(value) === key
  const matchingCase = Object.keys(cases).find(hasKey) || '_'
  const result = cases[matchingCase]

  if (result === null || (typeof result === 'undefined')) {
    throw new Error('Match error')
  }

  return result
}

export default match
