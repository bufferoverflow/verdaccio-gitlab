/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-gitlab-unit-jest',
  verbose: true,
  rootDir: '..',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.{js,jsx}'
  ],
  testRegex: 'test/unit/.*\\.spec\\.js',
  coveragePathIgnorePatterns: [
    'node_modules',
    'fixtures',
  ]
};
