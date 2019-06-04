"use strict";

const chai = require("chai");
const parseTrie = require("../../src/tries/parseTrie");

const expect = chai.expect;

describe("parseTrie()", () => {
    describe("basic cases", () => {
        it("returns a set", () => {
            expect(parseTrie("")).to.be.instanceOf(Set);
        });

        it("returns an empty set when an empty string is given", () => {
            const trie = parseTrie("");

            expect(trie.size).to.equal(0);
        });
    });

    describe("with SAME separator", () => {
        it("returns a set with the expected domains", () => {
            const trie = parseTrie("a,b,c");

            expect(trie.has("a")).to.equal(true);
            expect(trie.has("b")).to.equal(true);
            expect(trie.has("c")).to.equal(true);
            expect(trie.size).to.equal(3);
        });
    });

    describe("with DOWN separator", () => {
        it("returns a set with the expected domains", () => {
            const trie = parseTrie("a>a>a");

            expect(trie.has("a")).to.equal(true);
            expect(trie.has("a.a")).to.equal(true);
            expect(trie.has("a.a.a")).to.equal(true);
            expect(trie.size).to.equal(3);
        });
    });

    describe("and with UP separator", () => {
        it("returns a set with the expected domains", () => {
            const trie = parseTrie("a>a,b<b>a,b");
            
            expect(trie.has("a")).to.equal(true);
            expect(trie.has("a.a")).to.equal(true);
            expect(trie.has("a.b")).to.equal(true);
            expect(trie.has("b")).to.equal(true);
            expect(trie.has("b.a")).to.equal(true);
            expect(trie.has("b.b")).to.equal(true);
            expect(trie.size).to.equal(6);
        });

        it("goes up multiple levels", () => {
            const trie = parseTrie("a>a>a>a<<<b");
            
            expect(trie.has("b")).to.equal(true);
            expect(trie.size).to.equal(5);
        });
    });

    describe("and with RESET separator", () => {
        it("resets the domain level", () => {
            const trie = parseTrie("a>a|b");

            expect(trie.has("b")).to.equal(true);
            expect(trie.size).to.equal(3);
        });

        it("works also on the top-level", () => {
            const trie = parseTrie("a|b");

            expect(trie.has("b")).to.equal(true);
            expect(trie.size).to.equal(2);
        });
    });

    describe("with other special characters like * and !", () => {
        it("does not treat them special", () => {
            const trie = parseTrie("*,!>*,!");

            expect(trie.has("*")).to.equal(true);
            expect(trie.has("!")).to.equal(true);
            expect(trie.has("!.*")).to.equal(true);
            expect(trie.has("!.!")).to.equal(true);
        });
    });

    describe("complex cases", () => {
        it("parses 'a>a>a>a<<b,c|b>a>a<b>a>a,b' correctly", () => {
            const trie = parseTrie("a>a>a>a<<b,c|b>a>a<b>a>a,b");

            expect(trie.has("a")).to.equal(true);
            expect(trie.has("a.a")).to.equal(true);
            expect(trie.has("a.a.a")).to.equal(true);
            expect(trie.has("a.a.a.a")).to.equal(true);
            expect(trie.has("a.b")).to.equal(true);
            expect(trie.has("a.c")).to.equal(true);
            expect(trie.has("b")).to.equal(true);
            expect(trie.has("b.a")).to.equal(true);
            expect(trie.has("b.a.a")).to.equal(true);
            expect(trie.has("b.b")).to.equal(true);
            expect(trie.has("b.b.a")).to.equal(true);
            expect(trie.has("b.b.a.a")).to.equal(true);
            expect(trie.has("b.b.a.b")).to.equal(true);
            expect(trie.size).to.equal(13);
        });
    });
});
