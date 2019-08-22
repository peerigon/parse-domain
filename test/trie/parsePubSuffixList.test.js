"use strict";

const fs = require("fs");
const path = require("path");
const parsePubSuffixList = require("../../lib/trie/parsePubSuffixList");

const pathToFixtures = path.resolve(__dirname, "..", "fixtures");
const icannStart = "// ===BEGIN ICANN DOMAINS===";
const icannEnd = "// ===END ICANN DOMAINS===";
const privateStart = "// ===BEGIN PRIVATE DOMAINS===";
const privateEnd = "// ===END PRIVATE DOMAINS===";

describe("parsePubSuffixList()", () => {
    test("returns an object with empty lists by default", () => {
        const str = [icannStart, icannEnd, privateStart, privateEnd].join("\n");

        expect(parsePubSuffixList(str)).toEqual({
            icann: [],
            private: [],
        });
    });

    test(
        "splits the list by the line break character \\n (ignoring \\r if present)",
        () => {
            const str = [
                icannStart,
                "a.b.c\r",
                "a",
                "b\r",
                icannEnd + "\r",
                privateStart,
                "a.b.c",
                "a",
                "b",
                privateEnd,
            ].join("\n");

            expect(parsePubSuffixList(str)).toEqual({
                icann: ["a.b.c", "a", "b"],
                private: ["a.b.c", "a", "b"],
            });
        }
    );

    test("removes lines that start with a // sequence", () => {
        const str = [
            icannStart,
            "// comment",
            "a.b.c",
            "a",
            "b",
            "//another comment",
            icannEnd,
            privateStart,
            "a.b.c",
            "//",
            "a",
            " // ",
            "b",
            privateEnd,
        ].join("\n");

        expect(parsePubSuffixList(str)).toEqual({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    test("removes empty lines", () => {
        const str = [
            icannStart,
            " ",
            "a.b.c",
            "a",
            "b",
            "\r",
            icannEnd,
            privateStart,
            "a.b.c",
            "\t",
            "a",
            "b",
            privateEnd,
        ].join("\n");

        expect(parsePubSuffixList(str)).toEqual({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    test("throws when the ICANN start marker is missing ", () => {
        const str = [""].join("\n");

        expect(() => parsePubSuffixList(str)).toThrowError("Missing start marker of icann list");
    });

    test("throws when the ICANN end marker is missing ", () => {
        const str = [icannStart].join("\n");

        expect(() => parsePubSuffixList(str)).toThrowError("Missing end marker of icann list");
    });

    test("throws when the PRIVATE start marker is missing ", () => {
        const str = [icannStart, icannEnd].join("\n");

        expect(() => parsePubSuffixList(str)).toThrowError("Missing start marker of private list");
    });

    test("throws when the PRIVATE end marker is missing ", () => {
        const str = [icannStart, icannEnd, privateStart].join("\n");

        expect(() => parsePubSuffixList(str)).toThrowError("Missing end marker of private list");
    });

    describe("with fixtures", () => {
        const pubSuffixList = fs.readFileSync(path.resolve(pathToFixtures, "pubSuffixList.txt"), "utf8");

        test("returns the expected result (based on samples)", () => {
            const parsedList = parsePubSuffixList(pubSuffixList);

            expect(Array.isArray(parsedList.icann)).toBe(true);
            expect(Array.isArray(parsedList.private)).toBe(true);
            expect(parsedList.icann).toEqual(expect.arrayContaining(["com"]));
            expect(parsedList.icann).toEqual(expect.arrayContaining(["co.uk"]));
            expect(parsedList.private).toEqual(expect.arrayContaining(["herokuapp.com"]));
        });
    });
});
