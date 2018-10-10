import match, { lazyMatch } from '../src/'

const pattern = {
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
}
const fontSize1 = match('title', pattern)
console.assert(fontSize1 === 16, 'Failed to match the title')

const fontSize2 = match('unknown', pattern)
console.assert(fontSize2 === 13, 'Failed to match the default case')

const fontSize3 = ['h1', 'h2', 'x'].map(lazyMatch(pattern))
console.assert(fontSize3[0] === 20, 'Failed to match an array')
console.assert(fontSize3[1] === 18, 'Failed to match an array')
console.assert(fontSize3[2] === 13, 'Failed to match an array')

console.log('Tests passed')
