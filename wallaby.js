/* global module, process */
module.exports = function(wallaby) {
  process.env.NODE_ENV = 'test'

  return {
    files: ['src/**/*.js', 'package.json', '!src/**/*.spec.js'],

    tests: ['src/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },

    setup: function() {
      var jestConfig = require('./package.json').jest
      wallaby.testFramework.configure(jestConfig)
    },
  }
}
