"use strict";

const parse = require("../lib/trie/parse");

module.exports = parse(require("../build/tries/icann.light.json").trie);
