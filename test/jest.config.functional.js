/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-gitlab-functional-jest',
  verbose: true,
  rootDir: '..',
  testEnvironment: './test/functional/test-environment.js',
  globalSetup: './test/functional/pre-setup.js',
  globalTeardown: './test/functional/teardown.js',
  collectCoverage: false,
  testRegex: 'test/functional/.*.spec\\.js',
};
