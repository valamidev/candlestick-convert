module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [2345]
      }
    }
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules|dist/'],
  collectCoverageFrom: ['src/**/*.ts'],
  testRegex: '(/__tests1__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
};