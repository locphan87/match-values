import match, { lazyMatch, _ } from '../src/'

describe('match', () => {
  const pattern = {
    h1: 20,
    h2: 18,
    title: 16,
    description: 14,
    _: 13
  }
  describe('match string', () => {
    test('should match a string', () => {
      expect(match('h1', pattern)).toBe(20)
      expect(match('title', pattern)).toBe(16)
      expect(match('unknown', pattern)).toBe(13)
    })
  })
  describe('match number', () => {
    test('should match a number', () => {
      const pattern = {
        1: 'a',
        2: 'b',
        _: 'any'
      }
      expect(match(1, pattern)).toBe('a')
      expect(match(2, pattern)).toBe('b')
      expect(match('title', pattern)).toBe('any')
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
  describe('match conditions', () => {
    const pattern2 = [
      [(x) => x === 5, 'ok'],
      [(x) => x > 5, 'great'],
      [_, 'default']
    ]
    test('should match correct conditions', () => {
      expect(match(5, pattern2)).toEqual('ok')
      expect(match(7, pattern2)).toEqual('great')
    })
    test('should match the default case', () => {
      expect(match(4, pattern2)).toEqual('default')
    })
  })
})
