"use strict";

const parse = require("../lib/trie/parse");

module.exports = parse(require("../build/tries/private.complete.json").trie);
