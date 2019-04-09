import match, { lazyMatch, matchArray } from '../src/'

const pattern1 = {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
}
console.assert(match('title', pattern1) === 16, 'Failed to match the title')
console.assert(match('unknown', pattern1) === 13, 'Failed to match the default case')

const fontSize = ['h1', 'h2', 'x'].map(lazyMatch(pattern1))
console.assert(fontSize[0] === 20, 'Failed to match a pattern lazily')
console.assert(fontSize[1] === 18, 'Failed to match a pattern lazily')
console.assert(fontSize[2] === 13, 'Failed to match a pattern lazily')

const pattern2 = [
  (a, b = 10, c) => {
    return a + b + c
  },
  (a, b) => {
    return a + b
  },
  a => a,
  _ => 0
]
console.assert(matchArray([], pattern2) === 0, 'Failed to match an array')
console.assert(matchArray([1, 2, 3], pattern2) === 6, 'Failed to match an array')
console.assert(matchArray([1, undefined, 3], pattern2) === 14, 'Failed to match an array')
console.assert(matchArray([1, 2], pattern2) === 3, 'Failed to match an array')
console.assert(matchArray([50], pattern2) === 50, 'Failed to match an array')

console.log('Tests passed')
