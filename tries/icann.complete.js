"use strict";

const parseTrie = require("../lib/tries/parseTrie");

module.exports = parseTrie(require("../build/lists/icann.complete.json").trie);
