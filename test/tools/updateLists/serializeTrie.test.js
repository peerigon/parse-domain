"use strict";

const { expect } = require("chai");
const serializeTrie = require("../../../tools/updateLists/serializeTrie");

describe("serializeTrie()", () => {
    [
        [[], ""],
        // All tlds with just one element are not included in the list
        [["a"], ""],
        [["a", "b", "c"], ""],
        // One level tlds are filtered out, two-level tlds not
        [["a.a", "b", "c"], "a>a"],
        // Identical lines are ignored
        [["a.a", "a.a", "a.a"], "a>a"],
        // Down separators are applied
        [["a", "a.a", "a.a.a", "a.a.a.a"], "a>a>a>a"],
        // The occurence order has no impact on the result
        [["a.a.a.a", "a.a.a", "a.a", "a"], "a>a>a>a"],
        // Same level separators are applied
        [["a.a", "b.a", "c.a"], "a>a,b,c"],
        // Up separators are applied
        [["a", "a.a", "a.a.a", "a.b.a", "a.c.a"], "a>a>a<b>a<c>a"],
        // Reset separators are applied
        [["a.a.a.a", "b.b.b", "c.c"], "a>a>a>a|b>b>b|c>c"],
        // Mixed cases
        [["a.a.a.a", "b.a", "c.a", "a.a.b", "a.a.b.b", "b.a.b.b"], "a>a>a>a<<b,c|b>a>a<b>a>a,b"],
        // Real-world use cases
        [["com", "de", "uk", "co.uk"], "uk>co"],
        [["uk", "ac.uk", "co.uk"], "uk>ac,co"],
        [["pl", "gov.pl", "ap.gov.pl"], "pl>gov>ap"],
        [
            ["pl", "gov.pl", "ap.gov.pl", "net.pl"],
            "pl>gov>ap<net",
        ],
        [["pl", "gov.pl", "ap.gov.pl", "uk", "ac.uk", "co.uk"], "pl>gov>ap|uk>ac,co"],
        [
            [
                "jp",
                "岐阜.jp",
                "静岡.jp",
                "موقع",
            ],
            "jp>岐阜,静岡",
        ],
        // Meaningful characters like the wildcard and the negation are not omitted
        [["*.ck", "!www.ck"], "ck>!www,*"],
        // This example is from the private domains list.
        // They are without the company domain (.ua in this case)
        [["cc.ua", "inf.ua", "ltd.ua"], "ua>cc,inf,ltd"],
    ].forEach(([parsedList, expectedString]) => {
        it(`maps ${ JSON.stringify(parsedList) } on ${ JSON.stringify(expectedString) }`, () => {
            expect(serializeTrie(parsedList)).to.equal(expectedString);
        });
    });
});