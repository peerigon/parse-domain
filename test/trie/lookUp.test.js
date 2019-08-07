"use strict";

const chai = require("chai");
const lookUp = require("../../lib/trie/lookUp");
const characters = require("../../lib/trie/characters");
const {createNode, adoptChild} = require("../../lib/trie/nodes");

const expect = chai.expect;

function createOneLevelDeepTrie() {
    const root = createNode();
    const com = createNode("com");

    adoptChild(root, com);

    return root;
}

function createTwoLevelDeepTrie() {
    const root = createNode();
    const uk = createNode("uk");
    const co = createNode("co");

    adoptChild(root, uk);
    adoptChild(uk, co);

    return root;
}

function createTrieWithWildcardAndException() {
    const root = createNode();
    const wildcard = createNode(characters.WILDCARD);
    const exception = createNode(characters.EXCEPTION + "exception");

    adoptChild(root, wildcard);
    adoptChild(root, exception);

    return root;
}

describe("lookUp()", () => {
    describe("with an empty trie", () => {
        it("returns an empty array", () => {
            const root = createNode();

            expect(lookUp(root, ["com"])).to.eql([]);
            expect(lookUp(root, ["example", "com"])).to.eql([]);
        });
    });
    describe("with a one level deep trie", () => {
        it("returns the known TLD as array", () => {
            const root = createOneLevelDeepTrie();

            expect(lookUp(root, ["com"])).to.eql(["com"]);
            expect(lookUp(root, ["example", "com"])).to.eql(["com"]);
            expect(lookUp(root, ["www", "example", "com"])).to.eql(["com"]);
        });
        it("returns an empty array if there is no known TLD", () => {
            const root = createOneLevelDeepTrie();

            expect(lookUp(root, ["de"])).to.eql([]);
            expect(lookUp(root, ["example", "de"])).to.eql([]);
            expect(lookUp(root, ["www", "example", "de"])).to.eql([]);
        });
    });
    describe("with a two level deep trie", () => {
        it("returns the known TLD", () => {
            const root = createTwoLevelDeepTrie();

            expect(lookUp(root, ["uk"])).to.eql(["uk"]);
            expect(lookUp(root, ["example", "uk"])).to.eql(["uk"]);
            expect(lookUp(root, ["co", "uk"])).to.eql(["co", "uk"]);
            expect(lookUp(root, ["example", "co", "uk"])).to.eql(["co", "uk"]);
            expect(lookUp(root, ["www", "example", "co", "uk"])).to.eql(["co", "uk"]);
        });

        it("returns an empty array if there is no known TLD", () => {
            const root = createTwoLevelDeepTrie();

            expect(lookUp(root, ["de"])).to.eql([]);
            expect(lookUp(root, ["example", "de"])).to.eql([]);
            expect(lookUp(root, ["www", "example", "de"])).to.eql([]);
        });
    });
    describe("with a wildcard and exceptions", () => {
        it("does not accept the exception as TLD", () => {
            const root = createTrieWithWildcardAndException();

            expect(lookUp(root, ["exception"])).to.eql([]);
            expect(lookUp(root, ["www", "exception"])).to.eql([]);
        });
        it("accepts all domain names as TLD in place of the wildcard", () => {
            const root = createTrieWithWildcardAndException();

            expect(lookUp(root, ["anything"])).to.eql(["anything"]);
            expect(lookUp(root, ["www", "anything"])).to.eql(["anything"]);
        });
    });
});
