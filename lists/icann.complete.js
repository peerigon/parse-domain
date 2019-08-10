"use strict";

const parse = require("../lib/trie/parse");

module.exports = parse(require("../build/tries/icann.complete.json").trie);
