import match, { lazyMatch, matchA } from '../src/'

describe('match', () => {
  const pattern = {
    h1: 20,
    h2: 18,
    title: 16,
    description: 14,
    _: 13 // use _ for the default case
  }
  describe('match value', () => {
    test('should match title', () => {
      expect(match('title', pattern)).toBe(16)
    })
    test('should match the default case', () => {
      expect(match('unknown', pattern)).toBe(13)
    })
  })
  describe('match lazily', () => {
    test('should get correctly the list of font sizes', () => {
      const fontSize = ['h1', 'h2', 'x'].map(lazyMatch(pattern))
      expect(fontSize[0]).toBe(20)
      expect(fontSize[1]).toBe(18)
      expect(fontSize[2]).toBe(13)
    })
  })
  describe.skip('match array', () => {
    const inputs = [
      [1],
      [1, 2],
      [1, 2, 3]
    ]
    const pattern2 = [
      [inputs[0], 'x1'],
      [inputs[1], 'x2'],
      [inputs[2], 'x3'],
      ['_', 'default'],
    ]
    test('should match correct array', () => {
      expect(matchA([1], pattern2)).toEqual('x1')
      expect(matchA([1, 2], pattern2)).toEqual('x2')
      expect(matchA([1, 2, 3], pattern2)).toEqual('x3')
    })
    test('should match the default case', () => {
      expect(matchA([0], pattern2)).toEqual('default')
    })
  })
  describe.skip('match object', () => {
    const inputs = [
      { a: 1 },
      { a: 1, b: 2},
      { a: 1, b: 2, c: 3}
    ]
    const pattern3 = [
      [inputs[0], 'x1'],
      [inputs[1], 'x2'],
      [inputs[2], 'x3'],
      ['_', 'default'],
    ]
    test('should match correct object', () => {
      expect(matchA(inputs[0], pattern3)).toEqual('x1')
      expect(matchA(inputs[1], pattern3)).toEqual('x2')
      expect(matchA(inputs[2], pattern3)).toEqual('x3')
    })
    test('should match the default case', () => {
      expect(matchA({}, pattern3)).toEqual('default')
    })
  })
})
