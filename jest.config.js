module.exports = {
  collectCoverage: true,
  testMatch: ['**/?(*.)+(spec|test).[j]s?(x)'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Match Values - Test Report'
      }
    ]
  ]
}
