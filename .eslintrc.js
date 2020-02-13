"use strict";

module.exports = {
	extends: [
		"peerigon",
		"peerigon/node",
		"peerigon/styles/no-null",
		"peerigon/styles/no-default-export",
		"peerigon/styles/prefer-arrow",
		"prettier",
	],
	parserOptions: {
		project: "./tsconfig.json",
	},
	root: true,
};
