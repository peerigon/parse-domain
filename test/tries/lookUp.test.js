"use strict";

const chai = require("chai");
const lookUp = require("../../lib/tries/lookUp");

const expect = chai.expect;

describe("lookUp()", () => {
    it("returns null if the trie is empty", () => {
        const trie = new Map();
        const hostname = "a.b.c";

        expect(lookUp(trie, hostname)).to.eql(null);
    });
    it("returns null if the trie contains no matching top-level domain", () => {
        const trie = new Map();
        const hostname = "a.b.c";

        trie.set("cc", true);

        expect(lookUp(trie, hostname)).to.eql(null);
    });
    it("returns the hostname if the hostname is a top-level domain", () => {
        const trie = new Map();
        const hostname = "a";

        trie.set("a", true);
        trie.set("b", true);

        expect(lookUp(trie, hostname)).to.eql("a");
    });
    it("returns the top-level domain from the hostname (2 domains)", () => {
        const trie = new Map();
        const hostname = "b.a";

        trie.set("a", true);
        trie.set("b", true);

        expect(lookUp(trie, hostname)).to.eql("a");
    });
    it("returns the top-level domain from the hostname (3 domains)", () => {
        const trie = new Map();
        const hostname = "c.b.a";

        trie.set("a", true);
        trie.set("b", true);

        expect(lookUp(trie, hostname)).to.eql("a");
    });
    it("returns the top-level domain (2 tlds) from the hostname (3 domains)", () => {
        const trie = new Map();
        const trieA = new Map();
        const hostname = "c.b.a";

        trieA.set("b", true);
        trie.set("a", trieA);
        trie.set("b", new Map());

        expect(lookUp(trie, hostname)).to.eql("b.a");
    });
    it("returns the top-level domain (3 tlds) from the hostname (4 domains)", () => {
        const trie = new Map();
        const trieA = new Map();
        const trieAB = new Map();
        const hostname = "d.c.b.a";

        trieAB.set("c", true);
        trieA.set("b", trieAB);
        trieA.set("a", true);
        trie.set("a", trieA);
        trie.set("b", new Map());

        expect(lookUp(trie, hostname)).to.eql("c.b.a");
    });
    it("interprets wildcards in the trie correctly (simple)", () => {
        const trie = new Map();
        const hostname = "a.b.c";

        trie.set("*", true);

        expect(lookUp(trie, hostname)).to.eql("c");
    });
    it("interprets wildcards in the trie correctly (nested)", () => {
        const trie = new Map();
        const trieA = new Map();
        const hostname = "c.b.a";

        trieA.set("*", true);
        trie.set("a", trieA);

        expect(lookUp(trie, hostname)).to.eql("b.a");
    });
    it("interprets exceptions of wildcards in the trie correctly (simple)", () => {
        const trie = new Map();
        const trieA = new Map();
        const hostname = "c.b.a";

        trieA.set("*", true);
        trieA.set("!b", true);
        trie.set("a", trieA);

        expect(lookUp(trie, hostname)).to.eql("a");
    });
    it("still handles wildcards correctly if there are non-matching exceptions", () => {
        const trie = new Map();
        const trieA = new Map();
        const hostname = "c.b.a";

        trieA.set("*", true);
        trieA.set("!a", true);
        trieA.set("!c", true);
        trie.set("a", trieA);

        expect(lookUp(trie, hostname)).to.eql("b.a");
    });
});
