import match from '../src/'

const fontSize1 = match('title')({
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
})
console.assert(fontSize1 === 16, 'Failed to match the title')

const fontSize2 = match('unknown')({
  h1: 20,
  h2: 18,
  title: 16,
  description: 14,
  _: 13 // use _ for the default case
})
console.assert(fontSize2 === 13, 'Failed to match the default case')

console.log('Tests passed')
