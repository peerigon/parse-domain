"use strict";

const { expect } = require("chai");
const parsePSList = require("../../../tools/updateLists/parsePSList");

const icannStart = "// ===BEGIN ICANN DOMAINS===";
const icannEnd = "// ===END ICANN DOMAINS===";
const privateStart = "// ===BEGIN PRIVATE DOMAINS===";
const privateEnd = "// ===END PRIVATE DOMAINS===";

describe("parsePSList()", () => {
    it("returns an object with empty lists by default", () => {
        const str = [icannStart, icannEnd, privateStart, privateEnd].join("\n");

        expect(parsePSList(str)).to.eql({
            icann: [],
            private: [],
        });
    });

    it("splits the list by the line break character \\n (ignoring \\r if present)", () => {
        const str = [
            icannStart,
            "a.b.c\r", "a", "b\r",
            icannEnd + "\r",
            privateStart,
            "a.b.c", "a", "b",
            privateEnd,
        ].join("\n");

        expect(parsePSList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    it("removes lines that start with a // sequence", () => {
        const str = [
            icannStart,
            "// comment",
            "a.b.c", "a", "b",
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

        expect(parsePSList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });

    it("removes empty lines", () => {
        const str = [
            icannStart,
            " ",
            "a.b.c", "a", "b",
            "\r",
            icannEnd,
            privateStart,
            "a.b.c",
            "\t",
            "a",
            "b",
            privateEnd,
        ].join("\n");

        expect(parsePSList(str)).to.eql({
            icann: ["a.b.c", "a", "b"],
            private: ["a.b.c", "a", "b"],
        });
    });
});