"use strict";

const options = require("eslint-config-peerigon/options");

module.exports = {
	plugins: ["no-null"],
	extends: ["peerigon/typescript"],
	rules: {
		"import/no-default-export": "error",
		// "no-null/no-null": "error"
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			rules: {
				// "indent": [
				// 	"error",
				// 	"tab",
				// 	options["indent"],
				// ], // http://eslint.org/docs/rules/indent
				"@typescript-eslint/indent": ["error", "tab", options["indent"]], // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
				"no-tabs": ["error", {allowIndentationTabs: true}],
			},
		},
	],
};
