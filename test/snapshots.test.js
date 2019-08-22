"use strict";

const fs = require("fs");
const path = require("path");
const parsePubSuffixList = require("../lib/trie/parsePubSuffixList");
const serializeTrie = require("../lib/trie/serializeTrie");

const TEST_SNAPSHOT = true;
const pathToFixtures = path.resolve(__dirname, "fixtures");
const pathToSnapshots = path.resolve(__dirname, "snapshots");
const pathToParsePubSuffixListSnapshot = path.resolve(pathToSnapshots, "parsePubSuffixList.json");
const pathToSerializeTrieSnapshot = path.resolve(pathToSnapshots, "serializeTrie.json");

describe("snapshots", () => {
    describe("parsePubSuffixList()", () => {
        test("matches the approved snapshot", () => {
            const pubSuffixList = fs.readFileSync(path.resolve(pathToFixtures, "pubSuffixList.txt"), "utf8");
            const parsedList = parsePubSuffixList(pubSuffixList);
            const snapshot = JSON.parse(fs.readFileSync(pathToParsePubSuffixListSnapshot, "utf8"));

            TEST_SNAPSHOT && expect(parsedList).toEqual(snapshot);
            fs.writeFileSync(pathToParsePubSuffixListSnapshot, JSON.stringify(parsedList));
        });
    });
    describe("serializeTrie()", () => {
        test("matches the approved snapshot", () => {
            const parsedList = JSON.parse(fs.readFileSync(pathToParsePubSuffixListSnapshot, "utf8"));
            const snapshot = JSON.parse(fs.readFileSync(pathToSerializeTrieSnapshot, "utf8"));
            const serializedTrie = serializeTrie(parsedList.icann);

            TEST_SNAPSHOT && expect(serializedTrie).toEqual(snapshot);
            fs.writeFileSync(pathToSerializeTrieSnapshot, JSON.stringify(serializedTrie));
        });
    });
});
