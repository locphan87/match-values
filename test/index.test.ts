import match, { lazyMatch, _, matchCond } from '../src/'

describe('match', () => {
  const pattern = {
    format: {
      h1: 20,
      h2: 18,
      title: 16,
      description: 14,
      _: 13
    },
    number: {
      1: 'a',
      2: 'b',
      _: 'any'
    },
    cond: [
      [(x) => x === 5, 'ok'],
      [(x) => x > 5, 'great'],
      [_, 'default']
    ]
  }
  const errorPattern = {
    valueLastBranch: {
      first: '1',
      _: '10',
      second: '2'
    },
    valueNoMatch: {
      first: '1',
      second: '2'
    },
    condLastBranch: [
      [(x) => x === 5, '5'],
      [_, 'unknown'],
      [(x) => x > 5, 'greater']
    ],
    condInvalidBranch: [
      [(x) => x === 5, '5'],
      [2, 'greater'],
      [_, 'unknown']
    ],
    condInvalidBranch2: [[(x) => x === 5, '5'], [2], [_, 'unknown']],
    condNoMatch: [
      [(x) => x === 5, '5'],
      [(x) => x > 5, 'greater']
    ]
  }
  describe('match value', () => {
    test.each([
      ['format', 'h1', 20],
      ['format', 'title', 16],
      ['format', 'oops', 13],
      ['number', 1, 'a'],
      ['number', 2, 'b'],
      ['number', 'title', 'any']
    ])('should match the pattern %p: %p -> %p', (pt, ip, expected) => {
      expect(match(ip, pattern[pt])).toBe(expected)
    })
    test('should throw when _ is not the last branch', () => {
      try {
        match('f', errorPattern.valueLastBranch)
      } catch (e) {
        expect(e.message).toEqual('_ must be the last branch.')
      }
    })
    test('should throw when there is no match', () => {
      try {
        match('f', errorPattern.valueNoMatch)
      } catch (e) {
        expect(e.message).toEqual('Match error for value: f')
      }
    })
  })
  describe('match lazily', () => {
    const fontSize = ['h1', 'h2', 'x'].map(lazyMatch(pattern.format))
    test.each([
      [fontSize[0], 20],
      [fontSize[1], 18],
      [fontSize[2], 13]
    ])('should get the expected result: %p', (ip, expected) => {
      expect(ip).toBe(expected)
    })
  })
  describe('match conditions', () => {
    test.each([
      [5, 'ok'],
      [7, 'great'],
      [4, 'default']
    ])('should get the expected result: %p -> %p', (ip, expected) => {
      expect(match(ip, pattern.cond)).toBe(expected)
    })
    test('should throw when _ is not the last branch', () => {
      try {
        matchCond(10, errorPattern.condLastBranch)
      } catch (e) {
        expect(e.message).toEqual('_ must be the last branch.')
      }
    })
    test('should throw when _ there is an invalid branch', () => {
      try {
        matchCond(50, errorPattern.condInvalidBranch)
      } catch (e) {
        expect(e.message).toEqual(
          'The first element of normal branch must be a predicate function.'
        )
      }
    })
    test('should throw when _ there is a branch with only 1 element', () => {
      try {
        matchCond(50, errorPattern.condInvalidBranch2)
      } catch (e) {
        expect(e.message).toEqual(
          'Invalid branch [2]. Each branch must be an array of 2 items.'
        )
      }
    })
    test('should throw when there is no match', () => {
      try {
        matchCond(1, errorPattern.condNoMatch)
      } catch (e) {
        expect(e.message).toEqual('Match error for value: 1')
      }
    })
  })
})
