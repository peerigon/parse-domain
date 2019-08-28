"use strict";

module.exports = {
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	// There's currently a problem with collecting the coverage data on Travis
	// in combination with our scripts/link-src.js approach.
	// Seems like Jest is handling symlinks inconsistenly on macOS and Linux.
	// TODO: Enable this again once we're using TypeScript
	// collectCoverage: true,
	// coverageThreshold: {
	//     "./src/**/*.js": {
	//         branches: 100,
	//         functions: 100,
	//         lines: 100,
	//         statements: 100,
	//     },
	// },
};
