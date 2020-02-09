"use strict";

module.exports = {
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	globals: {
		"ts-jest": {
			diagnostics: false,
		},
	},
	collectCoverage: true,
	coverageThreshold: {
		"./src/**/*.js": {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	watchPathIgnorePatterns: ["<rootDir>/src/tests/fs"],
};
