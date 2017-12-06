"use strict";

const { expect } = require("chai");
const serializeTrie = require("../../../tools/updateLists/serializeTrie");

describe("serializeTrie()", () => {
    [
        [[], ""],
        [["com"], "com"],
        [["com", "de"], "com|de"],
        [["uk", "co.uk"], "uk| co"],
        [["uk", "ac.uk", "co.uk"], "uk| ac| co"],
        [["pl", "gov.pl", "ap.gov.pl"], "pl| gov|  ap"],
        [
            ["pl", "gov.pl", "ap.gov.pl", "net.pl"],
            "pl| gov|  ap| net",
        ],
        [
            [
                "com",
                "jp",
                "岐阜.jp",
                "静岡.jp",
                "uk",
                "co.uk",
                "gov.uk",
                "موقع",
            ],
            "com|jp| 岐阜| 静岡|uk| co| gov|موقع",
        ],
    ].forEach(([parsedList, expectedString]) => {
        it(`maps ${ JSON.stringify(parsedList) } on ${ JSON.stringify(expectedString) }`, () => {
            expect(serializeTrie(parsedList)).to.equal(expectedString);
        });
    });

    it("sorts the input", () => {
        expect(serializeTrie(["co.uk", "uk", "ac.uk"])).to.equal("uk| ac| co");
    });

    it("sorts the input (foreign characters)", () => {
        expect(serializeTrie([
            "gov.uk",
            "jp",
            "岐阜.jp",
            "uk",
            "静岡.jp",
            "com",
            "موقع",
            "co.uk",
        ])).to.equal("com|jp| 岐阜| 静岡|uk| co| gov|موقع");
    });
});