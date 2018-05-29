"use strict";

const chai = require("chai");
const parseTrie = require("../../lib/tries/parseTrie");

const expect = chai.expect;

describe("parseTrie()", () => {
    describe("basic cases", () => {
        it("returns a map", () => {
            expect(parseTrie("")).to.be.instanceOf(Map);
        });

        it("returns an empty map when an empty string is given", () => {
            const trie = parseTrie("");

            expect(trie.size).to.equal(0);
        });

        it("returns a map with the given domain as key and true as value", () => {
            const trie = parseTrie("some-domain");
            const someDomain = trie.get("some-domain");

            expect(someDomain).to.equal(true);
        });
    });

    describe("with SAME separator", () => {
        it("returns a map with the given domains as key and true as value", () => {
            const trie = parseTrie("a,b,c");
            const a = trie.get("a");
            const b = trie.get("b");
            const c = trie.get("c");

            expect(a).to.equal(true);
            expect(b).to.equal(true);
            expect(c).to.equal(true);
        });
    });

    describe("and with DOWN separator", () => {
        it("returns a nested map", () => {
            const trie = parseTrie("a>a");
            const a = trie.get("a");
            const aa = a.get("a");

            expect(aa).to.equal(true);
        });

        it("returns a deeply nested map", () => {
            const trie = parseTrie("a>a>a");
            const a = trie.get("a");
            const aa = a.get("a");
            const aaa = aa.get("a");

            expect(aa).to.be.instanceOf(Map);
            expect(aaa).to.equal(true);
        });

        it("returns a nested map with the given domains as key and true as value", () => {
            const trie = parseTrie("a>a,b,c");
            const a = trie.get("a");
            const aa = a.get("a");
            const ab = a.get("b");
            const ac = a.get("c");

            expect(aa).to.equal(true);
            expect(ab).to.equal(true);
            expect(ac).to.equal(true);
        });
    });

    describe("and with UP separator", () => {
        it("returns a map with maps", () => {
            const trie = parseTrie("a>a,b<b>a,b");
            const a = trie.get("a");
            const aa = a.get("a");
            const ab = a.get("a");
            const b = trie.get("b");
            const ba = b.get("a");
            const bb = b.get("b");

            expect(aa).to.equal(true);
            expect(ab).to.equal(true);
            expect(ba).to.equal(true);
            expect(bb).to.equal(true);
        });

        it("goes up multiple levels", () => {
            const trie = parseTrie("a>a>a>a<<<b");
            const a = trie.get("a");
            const aa = a.get("a");
            const aaa = aa.get("a");
            const aaaa = aaa.get("a");
            const b = trie.get("b");

            expect(aaaa).to.equal(true);
            expect(b).to.equal(true);
        });
    });

    describe("and with RESET separator", () => {
        it("resets the domain level", () => {
            const trie = parseTrie("a>a|b");
            const a = trie.get("a");
            const aa = a.get("a");
            const b = trie.get("b");

            expect(aa).to.equal(true);
            expect(b).to.equal(true);
        });

        it("works also on the top-level", () => {
            const trie = parseTrie("a|b");
            const a = trie.get("a");
            const b = trie.get("b");

            expect(a).to.equal(true);
            expect(b).to.equal(true);
        });

        it("returns the expected trie", () => {
            const trie = parseTrie("a>a>a|b>a|c");
            const a = trie.get("a");
            const aa = a.get("a");
            const aaa = aa.get("a");
            const b = trie.get("b");
            const ba = b.get("a");
            const c = trie.get("c");

            expect(aaa).to.equal(true);
            expect(ba).to.equal(true);
            expect(c).to.equal(true);
        });
    });

    describe("complex cases", () => {
        it("parses 'a>a>a>a<<b,c|b>a>a<b>a>a,b' without errors", () => {
            const trie = parseTrie("a>a>a>a<<b,c|b>a>a<b>a>a,b");
            const a = trie.get("a");
            const aa = a.get("a");
            const aaa = aa.get("a");
            const aaaa = aaa.get("a");
            const ab = a.get("b");
            const ac = a.get("c");
            const b = trie.get("b");
            const ba = b.get("a");
            const baa = ba.get("a");
            const bb = b.get("b");
            const bba = bb.get("a");
            const bbaa = bba.get("a");
            const bbab = bba.get("b");

            expect(aaaa).to.equal(true);
            expect(ab).to.equal(true);
            expect(ac).to.equal(true);
            expect(baa).to.equal(true);
            expect(bbaa).to.equal(true);
            expect(bbab).to.equal(true);
        });
    });
});
