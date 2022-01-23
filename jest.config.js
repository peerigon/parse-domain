// eslint-disable-next-line import/no-default-export
export default {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  collectCoverage: true,
  coverageThreshold: {
    "./src/**/*.ts": {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/tests",
    "<rootDir>/node_modules/",
  ],
};
