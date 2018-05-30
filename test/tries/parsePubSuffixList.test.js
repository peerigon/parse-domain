"use strict";

const fs = require("fs");
const path = require("path");
const chai = require("chai");
const parsePubSuffixList = require("../../lib/tries/parsePubSuffixList");

const expect = chai.expect;
const pathToFixtures = path.resolve(__dirname, "..", "fixtures");
const icannStart = "// ===BEGIN ICANN DOMAINS===";
const icannEnd = "// ===END ICANN DOMAINS===";
const privateStart = "// ===BEGIN PRIVATE DOMAINS===";
const privateEnd = "// ===END PRIVATE DOMAINS===";

describe("parsePubSuffixList()", () => {
    it("returns an object with empty lists by default", () => {
        const str = [icannStart, icannEnd, privateStart, privateEnd].join("\n");

        expect(parsePubSuffixList(str)).to.eql({
            icann: [],
            private: [],
        });
    });

    it("splits the list by the line break character \\n (ignoring \\r if present)", () => {
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

        expect(parsePubSuffixList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    it("removes lines that start with a // sequence", () => {
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

        expect(parsePubSuffixList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    it("removes empty lines", () => {
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

        expect(parsePubSuffixList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    it("throws when the ICANN start marker is missing ", () => {
        const str = [""].join("\n");

        expect(() => parsePubSuffixList(str)).to.throw("Missing start marker of icann list");
    });

    it("throws when the ICANN end marker is missing ", () => {
        const str = [icannStart].join("\n");

        expect(() => parsePubSuffixList(str)).to.throw("Missing end marker of icann list");
    });

    it("throws when the PRIVATE start marker is missing ", () => {
        const str = [icannStart, icannEnd].join("\n");

        expect(() => parsePubSuffixList(str)).to.throw("Missing start marker of private list");
    });

    it("throws when the PRIVATE end marker is missing ", () => {
        const str = [icannStart, icannEnd, privateStart].join("\n");

        expect(() => parsePubSuffixList(str)).to.throw("Missing end marker of private list");
    });

    describe("with fixtures", () => {
        const pubSuffixList = fs.readFileSync(path.resolve(pathToFixtures, "pubSuffixList.txt"), "utf8");

        it("returns the expected result (based on samples)", () => {
            const parsedList = parsePubSuffixList(pubSuffixList);

            expect(parsedList.icann).to.be.an("array");
            expect(parsedList.private).to.be.an("array");
            expect(parsedList.icann).to.contain("com");
            expect(parsedList.icann).to.contain("co.uk");
            expect(parsedList.private).to.contain("herokuapp.com");
        });
    });
});
