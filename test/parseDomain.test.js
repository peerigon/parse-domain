"use strict";

const parseDomain = require("../lib/parseDomain.js");

describe("parseDomain(url)", () => {
    test("should remove the protocol", () => {
        expect(parseDomain("http://example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("//example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("https://example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove sub-domains", () => {
        expect(parseDomain("www.example.com")).toEqual({
            subdomain: "www",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("www.some.other.subdomain.example.com")).toEqual({
            subdomain: "www.some.other.subdomain",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the path", () => {
        expect(parseDomain("example.com/some/path?and&query")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("example.com/")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the query string", () => {
        expect(parseDomain("example.com?and&query")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove special characters", () => {
        expect(parseDomain("http://m.example.com\r")).toEqual({
            subdomain: "m",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the port", () => {
        expect(parseDomain("example.com:8080")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the authentication", () => {
        expect(parseDomain("user:password@example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should allow @ characters in the path", () => {
        expect(parseDomain("https://medium.com/@username/")).toEqual({
            subdomain: "",
            domain: "medium",
            tld: "com",
        });
    });

    test("should also work with three-level domains like .co.uk", () => {
        expect(parseDomain("www.example.co.uk")).toEqual({
            subdomain: "www",
            domain: "example",
            tld: "co.uk",
        });
    });

    test("should not include private domains like blogspot.com by default", () => {
        expect(parseDomain("foo.blogspot.com")).toEqual({
            subdomain: "foo",
            domain: "blogspot",
            tld: "com",
        });
    });

    test("should include private tlds", () => {
        expect(parseDomain("foo.blogspot.com", {privateTlds: true})).toEqual({
            subdomain: "",
            domain: "foo",
            tld: "blogspot.com",
        });
    });

    test("should work when all url parts are present", () => {
        expect(parseDomain("https://user@www.some.other.subdomain.example.co.uk:8080/some/path?and&query#hash")).toEqual({
            subdomain: "www.some.other.subdomain",
            domain: "example",
            tld: "co.uk",
        });
    });

    test("should also work with the minimum", () => {
        expect(parseDomain("example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test(
        "should return null if the given url contains an unsupported top-level domain",
        () => {
            expect(parseDomain("example.kk")).toBeNull();
        }
    );

    test("should return null if the given value is not a string", () => {
        expect(parseDomain(undefined)).toBeNull();
        expect(parseDomain({})).toBeNull();
    });

    test("should return null if the given string is not a valid URL", () => {
        expect(parseDomain("\xa0")).toBeNull();
        expect(parseDomain("")).toBeNull();
        expect(parseDomain(" ")).toBeNull();
        expect(parseDomain("http://hell.d\ne.ibm.com")).toBeNull();
    });

    test(
        "should return null if the given is an empty string with a space character",
        () => {
            expect(parseDomain(" ")).toBeNull();
        }
    );

    test("should work with domains that could match multiple tlds", () => {
        expect(parseDomain("http://hello.de.ibm.com")).toEqual({
            subdomain: "hello.de",
            domain: "ibm",
            tld: "com",
        });
    });

    test("should work with custom top-level domains (eg .local)", () => {
        const options = {customTlds: ["local"]};

        expect(parseDomain("mymachine.local", options)).toEqual({
            subdomain: "",
            domain: "mymachine",
            tld: "local",
        });

        // Sanity checks if the option does not misbehave
        expect(parseDomain("mymachine.local")).toBe(null);
        expect(parseDomain("http://example.com", options)).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test(
        "should also work with custom top-level domains passed as regexps",
        () => {
            const options = {customTlds: /(\.local|localhost)$/};

            expect(parseDomain("mymachine.local", options)).toEqual({
                subdomain: "",
                domain: "mymachine",
                tld: "local",
            });
            expect(parseDomain("localhost", options)).toEqual({
                subdomain: "",
                domain: "",
                tld: "localhost",
            });
            expect(parseDomain("localhost:8080", options)).toEqual({
                subdomain: "",
                domain: "",
                tld: "localhost",
            });

            // Sanity checks if the option does not misbehave
            expect(parseDomain("mymachine.local")).toBe(null);
            expect(parseDomain("http://example.com", options)).toEqual({
                subdomain: "",
                domain: "example",
                tld: "com",
            });
        }
    );

    describe("real-world use cases", () => {
        // See https://github.com/peerigon/parse-domain/pull/65
        test("should parse police.uk as tld", () => {
            expect(parseDomain("example.police.uk")).toEqual({
                subdomain: "",
                domain: "example",
                tld: "police.uk",
            });
        });

        // See https://github.com/peerigon/parse-domain/issues/67
        test("should parse gouv.fr as tld", () => {
            expect(parseDomain("dev.classea12.beta.gouv.fr", {privateTlds: true})).toEqual({
                tld: "gouv.fr",
                domain: "beta",
                subdomain: "dev.classea12",
            });
        });
    });

    describe("official test suite", () => {
        test("passes all inputs", () => {
            function checkPublicSuffix(input, expectedTld) {
                const result = parseDomain(input, {privateTlds: true});

                if (expectedTld === null) {
                    // When the expectedTld is null it means that the domain
                    // should not be registerable.
                    // Our module will return an empty string for the domain
                    // in that case. The tld should match the input.
                    expect(result.tld).toBe(input.toLowerCase());
                    expect(result.domain).toBe("");
                } else {
                    expect(result.domain + "." + result.tld).toBe(expectedTld);
                }
            }

            // Any copyright is dedicated to the Public Domain.
            // https://creativecommons.org/publicdomain/zero/1.0/

            // null input.
            // checkPublicSuffix(null, null);
            // Mixed case.
            checkPublicSuffix("COM", null);
            checkPublicSuffix("example.COM", "example.com");
            checkPublicSuffix("WwW.example.COM", "example.com");
            // Leading dot.
            // TODO: Make this test work
            // checkPublicSuffix(".com", null);
            // checkPublicSuffix(".example", null);
            // checkPublicSuffix(".example.com", null);
            // checkPublicSuffix(".example.example", null);
            // Unlisted TLD.
            // This is a strange test case. Why should 'example.example' be registerable when 'example' is unknown?
            // checkPublicSuffix("example", null);
            // checkPublicSuffix("example.example", "example.example");
            // checkPublicSuffix("b.example.example", "example.example");
            // checkPublicSuffix("a.b.example.example", "example.example");
            // Listed, but non-Internet, TLD.
            // checkPublicSuffix('local', null);
            // checkPublicSuffix('example.local', null);
            // checkPublicSuffix('b.example.local', null);
            // checkPublicSuffix('a.b.example.local', null);
            // TLD with only 1 rule.
            checkPublicSuffix("biz", null);
            checkPublicSuffix("domain.biz", "domain.biz");
            checkPublicSuffix("b.domain.biz", "domain.biz");
            checkPublicSuffix("a.b.domain.biz", "domain.biz");
            // TLD with some 2-level rules.
            checkPublicSuffix("com", null);
            checkPublicSuffix("example.com", "example.com");
            checkPublicSuffix("b.example.com", "example.com");
            checkPublicSuffix("a.b.example.com", "example.com");
            checkPublicSuffix("uk.com", null);
            checkPublicSuffix("example.uk.com", "example.uk.com");
            checkPublicSuffix("b.example.uk.com", "example.uk.com");
            checkPublicSuffix("a.b.example.uk.com", "example.uk.com");
            checkPublicSuffix("test.ac", "test.ac");
            // TLD with only 1 (wildcard) rule.
            checkPublicSuffix("mm", null);
            checkPublicSuffix("c.mm", null);
            checkPublicSuffix("b.c.mm", "b.c.mm");
            checkPublicSuffix("a.b.c.mm", "b.c.mm");
            // More complex TLD.
            checkPublicSuffix("jp", null);
            checkPublicSuffix("test.jp", "test.jp");
            checkPublicSuffix("www.test.jp", "test.jp");
            checkPublicSuffix("ac.jp", null);
            checkPublicSuffix("test.ac.jp", "test.ac.jp");
            checkPublicSuffix("www.test.ac.jp", "test.ac.jp");
            checkPublicSuffix("kyoto.jp", null);
            checkPublicSuffix("test.kyoto.jp", "test.kyoto.jp");
            checkPublicSuffix("ide.kyoto.jp", null);
            checkPublicSuffix("b.ide.kyoto.jp", "b.ide.kyoto.jp");
            checkPublicSuffix("a.b.ide.kyoto.jp", "b.ide.kyoto.jp");
            checkPublicSuffix("c.kobe.jp", null);
            checkPublicSuffix("b.c.kobe.jp", "b.c.kobe.jp");
            checkPublicSuffix("a.b.c.kobe.jp", "b.c.kobe.jp");
            checkPublicSuffix("city.kobe.jp", "city.kobe.jp");
            checkPublicSuffix("www.city.kobe.jp", "city.kobe.jp");
            // TLD with a wildcard rule and exceptions.
            checkPublicSuffix("ck", null);
            checkPublicSuffix("test.ck", null);
            checkPublicSuffix("b.test.ck", "b.test.ck");
            checkPublicSuffix("a.b.test.ck", "b.test.ck");
            checkPublicSuffix("www.ck", "www.ck");
            checkPublicSuffix("www.www.ck", "www.ck");
            // US K12.
            checkPublicSuffix("us", null);
            checkPublicSuffix("test.us", "test.us");
            checkPublicSuffix("www.test.us", "test.us");
            checkPublicSuffix("ak.us", null);
            checkPublicSuffix("test.ak.us", "test.ak.us");
            checkPublicSuffix("www.test.ak.us", "test.ak.us");
            checkPublicSuffix("k12.ak.us", null);
            checkPublicSuffix("test.k12.ak.us", "test.k12.ak.us");
            checkPublicSuffix("www.test.k12.ak.us", "test.k12.ak.us");
            // IDN labels.
            checkPublicSuffix("食狮.com.cn", "食狮.com.cn");
            checkPublicSuffix("食狮.公司.cn", "食狮.公司.cn");
            checkPublicSuffix("www.食狮.公司.cn", "食狮.公司.cn");
            checkPublicSuffix("shishi.公司.cn", "shishi.公司.cn");
            checkPublicSuffix("公司.cn", null);
            checkPublicSuffix("食狮.中国", "食狮.中国");
            checkPublicSuffix("www.食狮.中国", "食狮.中国");
            checkPublicSuffix("shishi.中国", "shishi.中国");
            checkPublicSuffix("中国", null);
            // Same as above, but punycoded.
            // Punycode is currently not supported
            // TODO: Make these tests work
            // checkPublicSuffix("xn--85x722f.com.cn", "xn--85x722f.com.cn");
            // checkPublicSuffix("xn--85x722f.xn--55qx5d.cn", "xn--85x722f.xn--55qx5d.cn");
            // checkPublicSuffix("www.xn--85x722f.xn--55qx5d.cn", "xn--85x722f.xn--55qx5d.cn");
            // checkPublicSuffix("shishi.xn--55qx5d.cn", "shishi.xn--55qx5d.cn");
            // checkPublicSuffix("xn--55qx5d.cn", null);
            // checkPublicSuffix("xn--85x722f.xn--fiqs8s", "xn--85x722f.xn--fiqs8s");
            // checkPublicSuffix("www.xn--85x722f.xn--fiqs8s", "xn--85x722f.xn--fiqs8s");
            // checkPublicSuffix("shishi.xn--fiqs8s", "shishi.xn--fiqs8s");
            // checkPublicSuffix("xn--fiqs8s", null);
        });
    });
});
