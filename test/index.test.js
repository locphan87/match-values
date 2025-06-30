const { match, lazyMatch, last, matchCond } = require('../dist/index');

describe('match', () => {
  // Updated patterns to use the `last` symbol for default cases
  const pattern = {
    format: {
      h1: 20,
      h2: 18,
      title: 16,
      description: 14,
      [last]: 13,
    },
    number: {
      1: 'a',
      2: 'b',
      [last]: 'any',
    },
    cond: [
      [(x) => x === 5, 'ok'],
      [(x) => x > 5, 'great'],
      [(person) => person.name === 'Smith', 'Hello'],
      [(person) => person.name === 'Marie', 'Bonjour'],
      [last, 'default'],
    ],
  };

  // Updated error patterns and messages
  const errorPattern = {
    valueNoMatch: { first: '1', second: '2' },
    condLastBranch: [
      [(x) => x === 5, '5'],
      [last, 'unknown'],
      [(x) => x > 5, 'greater'],
    ],
    condInvalidPredicate: [
      [(x) => x === 5, '5'],
      ['invalid', 'greater'], // Invalid predicate (not a function)
      [last, 'unknown'],
    ],
    condInvalidBranch: [[(x) => x === 5, '5'], [2], [last, 'unknown']], // Invalid branch structure
    condNoMatch: [
      [(x) => x === 5, '5'],
      [(x) => x > 5, 'greater'],
    ],
  };

  describe('match value (object pattern)', () => {
    describe('successful matches', () => {
      it('should match exact values and default cases', () => {
        // Exact matches
        expect(match('h1', pattern.format)).toBe(20);
        expect(match('h2', pattern.format)).toBe(18);
        expect(match('title', pattern.format)).toBe(16);
        expect(match('description', pattern.format)).toBe(14);
        expect(match(1, pattern.number)).toBe('a');

        // Default matches
        expect(match('unknown', pattern.format)).toBe(13);
        expect(match(99, pattern.number)).toBe('any');
      });
    });

    describe('error cases', () => {
      it('should throw when no value matches', () => {
        expect(() => match('f', errorPattern.valueNoMatch)).toThrow(
          'Match error: No matching case for search key "f"'
        );
      });
    });
  });

  describe('match conditions (conditional pattern)', () => {
    describe('successful matches', () => {
      it('should match various condition types', () => {
        // Exact condition
        expect(match(5, pattern.cond)).toBe('ok');

        // Numeric conditions
        expect(match(6, pattern.cond)).toBe('great');
        expect(match(10, pattern.cond)).toBe('great');

        // Object conditions
        expect(match({ name: 'Smith' }, pattern.cond)).toBe('Hello');
        expect(match({ name: 'Marie' }, pattern.cond)).toBe('Bonjour');

        // Default cases
        expect(match(4, pattern.cond)).toBe('default');
        expect(match({ name: 'John' }, pattern.cond)).toBe('default');
      });
    });

    describe('error cases', () => {
      it('should throw if the default branch is not last', () => {
        expect(() => matchCond(10, errorPattern.condLastBranch)).toThrow(
          'The default branch (`last`) must be the final branch in the pattern.'
        );
      });

      it('should throw if a predicate is not a function', () => {
        expect(() => matchCond(50, errorPattern.condInvalidPredicate)).toThrow(
          'Invalid branch: The first element must be a predicate function or the `last` symbol.'
        );
      });

      it('should throw if a branch has an invalid structure', () => {
        expect(() => matchCond(50, errorPattern.condInvalidBranch)).toThrow(
          'Invalid branch: [2]. Each branch must be an array of 2 items.'
        );
      });

      it('should throw if no condition matches and there is no default', () => {
        expect(() => matchCond(1, errorPattern.condNoMatch)).toThrow(
          'Match error: No matching case for search key 1'
        );
      });
    });
  });

  describe('lazy matching', () => {
    it('should support lazy evaluation and function composition', () => {
      // Lazy evaluation with object pattern
      const getFontSize = lazyMatch(pattern.format);
      expect(getFontSize('h1')).toBe(20);
      expect(getFontSize('h2')).toBe(18);
      expect(getFontSize('unknown')).toBe(13);

      // Lazy evaluation with conditional pattern
      const getStatus = lazyMatch(pattern.cond);
      expect(getStatus(5)).toBe('ok');
      expect(getStatus({ name: 'John' })).toBe('default');

      // Array transformations
      const results = ['h1', 'h2', 'unknown'].map(lazyMatch(pattern.format));
      expect(results).toEqual([20, 18, 13]);
    });
  });
});