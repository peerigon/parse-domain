"use strict";

module.exports = {
	extends: [
		"peerigon",
		"peerigon/typescript",
		"peerigon/styles/no-null",
		"peerigon/styles/no-default-export",
		"peerigon/styles/prefer-arrow",
		"prettier",
		"prettier/@typescript-eslint",
	],
	parserOptions: {
		project: "./tsconfig.json",
	},
	root: true,
};
