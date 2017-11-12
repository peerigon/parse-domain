"use strict";

var chai = require("chai");
var expect = chai.expect;
var parseDomain = require("../lib/parseDomain.js");

chai.config.includeStack = true;

describe("parseDomain(url)", function () {

    it("should remove the protocol", function () {
        expect(parseDomain("http://example.com")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
        expect(parseDomain("https://example.com")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove sub-domains", function () {
        expect(parseDomain("www.example.com")).to.eql({
            subdomain: "www",
            domain: "example",
            tld: "com"
        });
        expect(parseDomain("www.some.other.subdomain.example.com")).to.eql({
            subdomain: "www.some.other.subdomain",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove the path", function () {
        expect(parseDomain("example.com/some/path?and&query")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
        expect(parseDomain("example.com/")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove the query string", function () {
        expect(parseDomain("example.com?and&query")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove special characters", function () {
        expect(parseDomain("http://m.example.com\r")).to.eql({
            subdomain: "m",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove the port", function () {
        expect(parseDomain("example.com:8080")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should remove the authentication", function () {
        expect(parseDomain("user:password@example.com")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should allow @ characters in the path", function () {
        expect(parseDomain("https://medium.com/@username/")).to.eql({
            subdomain: "",
            domain: "medium",
            tld: "com"
        });
    });

    it("should also work with three-level domains like .co.uk", function () {
        expect(parseDomain("www.example.co.uk")).to.eql({
            subdomain: "www",
            domain: "example",
            tld: "co.uk"
        });
    });

    it("should not include private domains like blogspot.com by default", function () {
        expect(parseDomain("foo.blogspot.com")).to.eql({
            subdomain: "foo",
            domain: "blogspot",
            tld: "com"
        });
    });

    it("should include private tlds", function () {
        expect(parseDomain("foo.blogspot.com", { privateTlds: true })).to.eql({
            subdomain: "",
            domain: "foo",
            tld: "blogspot.com"
        });
    });

    it("should work when all url parts are present", function () {
        expect(parseDomain("https://user@www.some.other.subdomain.example.co.uk:8080/some/path?and&query#hash")).to.eql({
            subdomain: "www.some.other.subdomain",
            domain: "example",
            tld: "co.uk"
        });
    });

    it("should also work with the minimum", function () {
        expect(parseDomain("example.com")).to.eql({
            subdomain: "",
            domain: "example",
            tld: "com"
        });
    });

    it("should return null if the given url contains an unsupported top-level domain", function () {
        expect(parseDomain("example.kk")).to.equal(null);
    });

    it("should return null if the given value is not a string", function () {
        expect(parseDomain(undefined)).to.equal(null);
        expect(parseDomain({})).to.equal(null);
        expect(parseDomain("")).to.equal(null);
    });

    it("should work with domains that could match multiple tlds", function () {
        expect(parseDomain("http://hello.de.ibm.com")).to.eql({
            subdomain: "hello.de",
            domain: "ibm",
            tld: "com"
        });
    });

    it("should work with custom top-level domains (eg .local)", function () {
        function parseCustomTlds(url) {
            var options = {
                customTlds: ["local"]
            };

            return parseDomain(url, options);
        }

        expect(parseDomain("mymachine.local")).to.eql(null);
        expect(parseDomain("mymachine.local", { customTlds: ["local"] })).to.eql({
            subdomain: "",
            domain: "mymachine",
            tld: "local"
        });
        expect(parseCustomTlds("mymachine.local")).to.eql({
            subdomain: "",
            domain: "mymachine",
            tld: "local"
        });
    });

    it("should behave itself when standard top-level domains sit atom custom top-level domains (eg .dev.local)", function () {
        expect(parseDomain("ohno.dev.local")).to.eql(null);
        expect(parseDomain("ohno.dev.local", { customTlds: ["local"] })).to.eql({
            subdomain: "ohno",
            domain: "dev",
            tld: "local"
        });
        expect(parseDomain("dev.local", { customTlds: ["local"] })).to.eql({
            subdomain: "",
            domain: "dev",
            tld: "local"
        });
    });

    it("should also work with custom top-level domains (eg .local) passed as regexps", function () {
        expect(parseDomain("mymachine.local")).to.eql(null);
        expect(parseDomain("mymachine.local", { customTlds: /\.local$/ })).to.eql({
            subdomain: "",
            domain: "mymachine",
            tld: "local"
        });
    });

    it("should also work with custom hostnames (eg localhost) when passed as a regexp", function () {
        function parseLocalDomains(url) {
            var options = {
                customTlds: /localhost|\.local/
            };

            return parseDomain(url, options);
        }

        expect(parseDomain("localhost")).to.eql(null);
        expect(parseDomain("localhost", { customTlds: /localhost$/ })).to.eql({
            subdomain: "",
            domain: "",
            tld: "localhost"
        });
        expect(parseLocalDomains("localhost")).to.eql({
            subdomain: "",
            domain: "",
            tld: "localhost"
        });
        expect(parseLocalDomains("localhost:8080")).to.eql({
            subdomain: "",
            domain: "",
            tld: "localhost"
        });
        expect(parseLocalDomains("mymachine.local")).to.eql({
            subdomain: "",
            domain: "mymachine",
            tld: "local"
        });
    });

});
