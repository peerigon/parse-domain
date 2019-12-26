"use strict";

const options = require("eslint-config-peerigon/options");

module.exports = {
	extends: ["peerigon", "peerigon/node", "peerigon/styles/prefer-arrow"],
	env: {
		node: true,
	},
	root: true,
	rules: {
		"indent": ["error", "tab", options["indent"]],
		"no-tabs": ["error", {allowIndentationTabs: true}],
	}
};
