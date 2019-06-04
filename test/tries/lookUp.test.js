"use strict";

const chai = require("chai");
const lookUp = require("../../src/tries/lookUp");

const expect = chai.expect;

describe("lookUp()", () => {
    it("returns null if the trie is empty", () => {
        const trie = new Set();
        const hostname = "a.b.c";

        expect(lookUp(trie, hostname)).to.equal(null);
    });
    it("returns null if the trie contains no matching top-level domain", () => {
        const trie = new Set();
        const hostname = "a.b.c";

        trie.add("cc");

        expect(lookUp(trie, hostname)).to.equal(null);
    });
    it("returns the hostname if the hostname is a top-level domain", () => {
        const trie = new Set();
        const hostname = "a";

        trie.add("a");

        expect(lookUp(trie, hostname)).to.equal("a");
    });
    it("returns the top-level domain from the hostname (2 domains)", () => {
        const trie = new Set();
        const hostname = "b.a";

        trie.add("a");
        trie.add("b");

        expect(lookUp(trie, hostname)).to.equal("a");
    });
    it("returns the top-level domain from the hostname (3 domains)", () => {
        const trie = new Set();
        const hostname = "c.b.a";

        trie.add("a");
        trie.add("b");

        expect(lookUp(trie, hostname)).to.equal("a");
    });
    it("returns the top-level domain (2 domains) from the hostname (3 domains)", () => {
        const trie = new Set();
        const hostname = "c.b.a";

        trie.add("a.b");

        expect(lookUp(trie, hostname)).to.equal("b.a");
    });
    it("returns the top-level domain (3 domains) from the hostname (4 domains)", () => {
        const trie = new Set();
        const hostname = "d.c.b.a";

        trie.add("a.b.c");

        expect(lookUp(trie, hostname)).to.equal("c.b.a");
    });
    it("interprets wildcards in the trie correctly (simple)", () => {
        const trie = new Set();
        const hostname = "a.b.c.d";

        trie.add("d.*");

        expect(lookUp(trie, hostname)).to.equal("c.d");
    });
    it("interprets exceptions of wildcards in the trie correctly (simple)", () => {
        const trie = new Set();
        const hostname = "c.b.a";

        trie.add("a");
        trie.add("a.*");
        trie.add("a.!b");

        expect(lookUp(trie, hostname)).to.equal("a");
    });
    it("still handles wildcards correctly if there are non-matching exceptions", () => {
        const trie = new Set();
        const hostname = "c.b.a";

        trie.add("a");
        trie.add("a.*");
        trie.add("a.!d");

        expect(lookUp(trie, hostname)).to.equal("b.a");
    });
});
