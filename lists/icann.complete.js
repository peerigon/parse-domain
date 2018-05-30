"use strict";

const parseTrie = require("../lib/tries/parseTrie");

module.exports = parseTrie(require("../build/tries/current/icann.complete.json").trie);
