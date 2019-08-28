"use strict";

const serializeTrie = require("../../lib/trie/serializeTrie");

describe("serializeTrie()", () => {
    [
    ].forEach(args => {
        const parsedList = args[0];
        const expectedString = args[1];

        test(
            `maps ${JSON.stringify(parsedList)} on ${JSON.stringify(expectedString)}`,
            () => {
                expect(serializeTrie(parsedList)).toBe(expectedString);
            }
        );
    });

    describe(`type ${serializeTrie.TYPE_LIGHT}`, () => {
        const type = serializeTrie.TYPE_LIGHT;

        [
            // All tlds with just one element are not included in the list
            [["a"], ""],
            [["a", "b", "c"], ""],
            // One level tlds are filtered out, two-level tlds not
            [["a.a", "b", "c"], "a>a"],
            // Real-world use cases
            [["com", "de", "uk", "co.uk"], "uk>co"],
            [["jp", "岐阜.jp", "静岡.jp", "موقع"], "jp>岐阜,静岡"],
        ].forEach(args => {
            const parsedList = args[0];
            const expectedString = args[1];

            test(
                `maps ${JSON.stringify(parsedList)} on ${JSON.stringify(expectedString)}`,
                () => {
                    expect(serializeTrie(parsedList, type)).toBe(expectedString);
                }
            );
        });
    });

    describe(`type ${serializeTrie.TYPE_COMPLETE}`, () => {
        const type = serializeTrie.TYPE_COMPLETE;

        [
            // One level tlds are included
            [["a"], "a"],
            [["a", "b", "c"], "a|b|c"],
            [["a.a", "b", "c"], "a>a|b|c"],
            // Real-world use cases
            [["com", "de", "uk", "co.uk"], "com|de|uk>co"],
            [["uk", "ac.uk", "co.uk"], "uk>ac,co"],
            [["pl", "gov.pl", "ap.gov.pl"], "pl>gov>ap"],
            [["pl", "gov.pl", "ap.gov.pl", "net.pl"], "pl>gov>ap<net"],
            [["pl", "gov.pl", "ap.gov.pl", "uk", "ac.uk", "co.uk"], "pl>gov>ap|uk>ac,co"],
            [["jp", "岐阜.jp", "静岡.jp", "موقع"], "jp>岐阜,静岡|موقع"],
            // https://github.com/peerigon/parse-domain/pull/65
            [["uk", "ac.uk", "police.uk", "*.sch.uk"], "uk>ac,police,sch>*"],
        ].forEach(args => {
            const parsedList = args[0];
            const expectedString = args[1];

            test(
                `maps ${JSON.stringify(parsedList)} on ${JSON.stringify(expectedString)}`,
                () => {
                    expect(serializeTrie(parsedList, type)).toBe(expectedString);
                }
            );
        });
    });

    describe("wrong usage", () => {
        expect(() => {
            serializeTrie([], "unsupported type");
        }).toThrowError(
            'Cannot serialize trie: Unknown trie type "unsupported type". Expected type to be one of complete, light'
        );
    });
});
