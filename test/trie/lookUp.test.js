"use strict";

const lookUp = require("../../lib/trie/lookUp");
const characters = require("../../lib/trie/characters");
const {createNode, adoptChild} = require("../../lib/trie/nodes");

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
        test("returns an empty array", () => {
            const root = createNode();

            expect(lookUp(root, ["com"])).toEqual([]);
            expect(lookUp(root, ["example", "com"])).toEqual([]);
        });
    });
    describe("with a one level deep trie", () => {
        test("returns the known TLD as array", () => {
            const root = createOneLevelDeepTrie();

            expect(lookUp(root, ["com"])).toEqual(["com"]);
            expect(lookUp(root, ["example", "com"])).toEqual(["com"]);
            expect(lookUp(root, ["www", "example", "com"])).toEqual(["com"]);
        });
        test("returns an empty array if there is no known TLD", () => {
            const root = createOneLevelDeepTrie();

            expect(lookUp(root, ["de"])).toEqual([]);
            expect(lookUp(root, ["example", "de"])).toEqual([]);
            expect(lookUp(root, ["www", "example", "de"])).toEqual([]);
        });
    });
    describe("with a two level deep trie", () => {
        test("returns the known TLD", () => {
            const root = createTwoLevelDeepTrie();

            expect(lookUp(root, ["uk"])).toEqual(["uk"]);
            expect(lookUp(root, ["example", "uk"])).toEqual(["uk"]);
            expect(lookUp(root, ["co", "uk"])).toEqual(["co", "uk"]);
            expect(lookUp(root, ["example", "co", "uk"])).toEqual(["co", "uk"]);
            expect(lookUp(root, ["www", "example", "co", "uk"])).toEqual(["co", "uk"]);
        });

        test("returns an empty array if there is no known TLD", () => {
            const root = createTwoLevelDeepTrie();

            expect(lookUp(root, ["de"])).toEqual([]);
            expect(lookUp(root, ["example", "de"])).toEqual([]);
            expect(lookUp(root, ["www", "example", "de"])).toEqual([]);
        });
    });
    describe("with a wildcard and exceptions", () => {
        test("does not accept the exception as TLD", () => {
            const root = createTrieWithWildcardAndException();

            expect(lookUp(root, ["exception"])).toEqual([]);
            expect(lookUp(root, ["www", "exception"])).toEqual([]);
        });
        test("accepts all domain names as TLD in place of the wildcard", () => {
            const root = createTrieWithWildcardAndException();

            expect(lookUp(root, ["anything"])).toEqual(["anything"]);
            expect(lookUp(root, ["www", "anything"])).toEqual(["anything"]);
        });
    });
});
