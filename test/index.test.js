const { match, lazyMatch, last, matchCond } = require('../dist/index')

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
      [(person) => person.name === 'Smith', 'Hello'],
      [(person) => person.name === 'Marie', 'Bonjour'],
      [last, 'default']
    ]
  }

  const errorPattern = {
    valueLastBranch: { first: '1', _: '10', second: '2' },
    valueNoMatch: { first: '1', second: '2' },
    condLastBranch: [
      [(x) => x === 5, '5'],
      [last, 'unknown'],
      [(x) => x > 5, 'greater']
    ],
    condInvalidBranch: [
      [(x) => x === 5, '5'],
      [2, 'greater'],
      [last, 'unknown']
    ],
    condInvalidBranch2: [[(x) => x === 5, '5'], [2], [last, 'unknown']],
    condNoMatch: [
      [(x) => x === 5, '5'],
      [(x) => x > 5, 'greater']
    ]
  }

  describe('match value', () => {
    describe('successful matches', () => {
      it('should match exact values and default cases', () => {
        // Exact matches
        expect(match('h1', pattern.format)).toBe(20)
        expect(match('h2', pattern.format)).toBe(18)
        expect(match('title', pattern.format)).toBe(16)
        expect(match('description', pattern.format)).toBe(14)

        // Default matches
        expect(match('unknown', pattern.format)).toBe(13)
        expect(match('nonexistent', pattern.number)).toBe('any')
      })
    })

    describe('error cases', () => {
      it('should handle error conditions', () => {
        expect(() => match('f', errorPattern.valueLastBranch))
          .toThrow('_ must be the last branch.')
        expect(() => match('f', errorPattern.valueNoMatch))
          .toThrow('Match error for search key: f')
      })
    })
  })

  describe('match conditions', () => {
    describe('successful matches', () => {
      it('should match various condition types', () => {
        // Exact condition
        expect(match(5, pattern.cond)).toBe('ok')
        
        // Numeric conditions
        expect(match(6, pattern.cond)).toBe('great')
        expect(match(10, pattern.cond)).toBe('great')
        
        // Object conditions
        expect(match({ name: 'Smith' }, pattern.cond)).toBe('Hello')
        expect(match({ name: 'Marie' }, pattern.cond)).toBe('Bonjour')
        
        // Default cases
        expect(match(4, pattern.cond)).toBe('default')
        expect(match({ name: 'John' }, pattern.cond)).toBe('default')
      })
    })

    describe('error cases', () => {
      it('should handle error conditions', () => {
        expect(() => matchCond(10, errorPattern.condLastBranch))
          .toThrow('_ must be the last branch.')
        expect(() => matchCond(50, errorPattern.condInvalidBranch))
          .toThrow('The first element of normal branch must be a predicate function.')
        expect(() => matchCond(50, errorPattern.condInvalidBranch2))
          .toThrow('Invalid branch [2]. Each branch must be an array of 2 items.')
        expect(() => matchCond(1, errorPattern.condNoMatch))
          .toThrow('Match error for search key: 1')
      })
    })
  })

  describe('lazy matching', () => {
    it('should support lazy evaluation and array transformations', () => {
      // Lazy evaluation
      const getFontSize = lazyMatch(pattern.format)
      expect(getFontSize('h1')).toBe(20)
      expect(getFontSize('h2')).toBe(18)
      expect(getFontSize('unknown')).toBe(13)

      // Array transformations
      const results = ['h1', 'h2', 'unknown'].map(lazyMatch(pattern.format))
      expect(results).toEqual([20, 18, 13])
    })
  })
})
