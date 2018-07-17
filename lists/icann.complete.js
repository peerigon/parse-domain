"use strict";

const parseTrie = require("../src/tries/parseTrie");

module.exports = parseTrie(require("../build/tries/current/icann.complete.json").trie);
