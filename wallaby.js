/* global module, process */
module.exports = function() {
  process.env.NODE_ENV = 'test'

  return {
    files: ['src/**/*.js', 'package.json', '!src/**/*.spec.js'],

    tests: ['src/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    setup: function(wallaby) {
      var jestConfig = require('./package.json').jest
      jestConfig.globals = { __DEV__: true }
      wallaby.testFramework.configure(jestConfig)
    },
  }
}
