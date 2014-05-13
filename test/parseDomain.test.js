"use strict";

var chai = require("chai"),
    expect = chai.expect,
    parseDomain = require("../lib/parseDomain.js");

chai.config.includeStack = true;

describe("parseDomain(url)", function () {

    it("should remove the protocol", function () {
        expect(parseDomain("http://example.com")).to.equal("example.com");
        expect(parseDomain("https://example.com")).to.equal("example.com");
    });

    it("should remove sub-domains", function () {
        expect(parseDomain("www.example.com")).to.equal("example.com");
        expect(parseDomain("www.some.other.subdomain.example.com")).to.equal("example.com");
    });

    it("should remove the path", function () {
        expect(parseDomain("example.com/some/path?and&query")).to.equal("example.com");
        expect(parseDomain("example.com/")).to.equal("example.com");
    });

    it("should remove the port", function () {
        expect(parseDomain("example.com:8080")).to.equal("example.com");
    });

    it("should remove the user", function () {
        expect(parseDomain("user@example.com")).to.equal("example.com");
    });

    it("should also work with three-level domains like .co.uk", function () {
        expect(parseDomain("www.example.co.uk")).to.equal("example.co.uk");
    });

    it("should work when all url parts are present", function () {
        expect(parseDomain("https://user@www.some.other.subdomain.example.co.uk:8080/some/path?and&query#hash")).to.equal("example.co.uk");
    });

    it("should not alter a normalized domain", function () {
        expect(parseDomain("example.com")).to.equal("example.com");
    });

    it("should just return an empty string if the given url contains an unsupported top-level domain", function () {
        expect(parseDomain("example.kk")).to.equal("");
    });

    it("should just return an empty string if the given value is not a string", function () {
        expect(parseDomain(undefined)).to.equal("");
        expect(parseDomain({})).to.equal("");
    });

    it("should work with domains that could match multiple tlds", function() {
        expect(parseDomain("http://hello.de.ibm.com")).to.equal("ibm.com");
    });

});