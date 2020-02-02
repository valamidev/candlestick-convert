"use strict";

module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [2345]
      }
    }
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
