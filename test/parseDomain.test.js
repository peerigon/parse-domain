"use strict";

const parseDomain = require("../src/parseDomain.js");

describe("parseDomain(url)", () => {
    test("should remove the protocol", () => {
        expect(parseDomain("http://example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
        expect(() => {
            parseDomain("//example.com");
        }).toThrow();
        expect(parseDomain("https://example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove sub-domains", () => {
        expect(parseDomain("http://www.example.com")).toEqual({
            subdomain: "www",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("http://www.some.other.subdomain.example.com")).toEqual({
            subdomain: "www.some.other.subdomain",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the path", () => {
        expect(parseDomain("http://example.com/some/path?and&query")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
        expect(parseDomain("http://example.com/")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the query string", () => {
        expect(parseDomain("http://example.com?and&query")).toEqual({
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
        expect(parseDomain("http://example.com:8080")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test("should remove the authentication", () => {
        expect(parseDomain("http://user:password@example.com")).toEqual({
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
        expect(parseDomain("http://www.example.co.uk")).toEqual({
            subdomain: "www",
            domain: "example",
            tld: "co.uk",
        });
    });

    test("should not include private domains like blogspot.com by default", () => {
        expect(parseDomain("http://foo.blogspot.com")).toEqual({
            subdomain: "foo",
            domain: "blogspot",
            tld: "com",
        });
    });

    test("should include private tlds", () => {
        expect(parseDomain("http://foo.blogspot.com", {privateTlds: true})).toEqual({
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
        expect(parseDomain("http://example.com")).toEqual({
            subdomain: "",
            domain: "example",
            tld: "com",
        });
    });

    test(
        "should return null if the given url contains an unsupported top-level domain",
        () => {
            expect(parseDomain("http://example.kk")).toBeNull();
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
        // expect(parseDomain("http://hell.d\ne.ibm.com")).toBeNull(); // actually url strips out the newline :)
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

        expect(parseDomain("http://mymachine.local", options)).toEqual({
            subdomain: "",
            domain: "mymachine",
            tld: "local",
        });

        // Sanity checks if the option does not misbehave
        expect(parseDomain("http://mymachine.local")).toBe(null);
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

            expect(parseDomain("http://mymachine.local", options)).toEqual({
                subdomain: "",
                domain: "mymachine",
                tld: "local",
            });
            expect(parseDomain("http://localhost", options)).toEqual({
                subdomain: "",
                domain: "",
                tld: "localhost",
            });
            expect(parseDomain("http://localhost:8080", options)).toEqual({
                subdomain: "",
                domain: "",
                tld: "localhost",
            });

            // Sanity checks if the option does not misbehave
            expect(parseDomain("http://mymachine.local")).toBe(null);
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
            expect(parseDomain("http://example.police.uk")).toEqual({
                subdomain: "",
                domain: "example",
                tld: "police.uk",
            });
        });

        // See https://github.com/peerigon/parse-domain/issues/67
        test("should parse gouv.fr as tld", () => {
            expect(parseDomain("http://dev.classea12.beta.gouv.fr", {privateTlds: true})).toEqual({
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
            // checkPublicSuffix("COM", null);
            checkPublicSuffix("http://example.COM", "example.com");
            checkPublicSuffix("http://WwW.example.COM", "example.com");
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
            // checkPublicSuffix("biz", null);
            checkPublicSuffix("http://domain.biz", "domain.biz");
            checkPublicSuffix("http://b.domain.biz", "domain.biz");
            checkPublicSuffix("http://a.b.domain.biz", "domain.biz");
            // TLD with some 2-level rules.
            // checkPublicSuffix("com", null);
            checkPublicSuffix("http://example.com", "example.com");
            checkPublicSuffix("http://b.example.com", "example.com");
            checkPublicSuffix("http://a.b.example.com", "example.com");
            // checkPublicSuffix("uk.com", null);
            checkPublicSuffix("http://example.uk.com", "example.uk.com");
            checkPublicSuffix("http://b.example.uk.com", "example.uk.com");
            checkPublicSuffix("http://a.b.example.uk.com", "example.uk.com");
            checkPublicSuffix("http://test.ac", "test.ac");
            // TLD with only 1 (wildcard) rule.
            // checkPublicSuffix("mm", null);
            // checkPublicSuffix("http://c.mm", null);
            checkPublicSuffix("http://b.c.mm", "b.c.mm");
            checkPublicSuffix("http://a.b.c.mm", "b.c.mm");
            // More complex TLD.
            // checkPublicSuffix("jp", null);
            checkPublicSuffix("http://test.jp", "test.jp");
            checkPublicSuffix("http://www.test.jp", "test.jp");
            // checkPublicSuffix("ac.jp", null);
            checkPublicSuffix("http://test.ac.jp", "test.ac.jp");
            checkPublicSuffix("http://www.test.ac.jp", "test.ac.jp");
            // checkPublicSuffix("kyoto.jp", null);
            checkPublicSuffix("http://test.kyoto.jp", "test.kyoto.jp");
            // checkPublicSuffix("http://ide.kyoto.jp", null);
            checkPublicSuffix("http://b.ide.kyoto.jp", "b.ide.kyoto.jp");
            checkPublicSuffix("http://a.b.ide.kyoto.jp", "b.ide.kyoto.jp");
            // checkPublicSuffix("http://c.kobe.jp", null);
            checkPublicSuffix("http://b.c.kobe.jp", "b.c.kobe.jp");
            checkPublicSuffix("http://a.b.c.kobe.jp", "b.c.kobe.jp");
            checkPublicSuffix("http://city.kobe.jp", "city.kobe.jp");
            checkPublicSuffix("http://www.city.kobe.jp", "city.kobe.jp");
            // TLD with a wildcard rule and exceptions.
            // checkPublicSuffix("ck", null);
            // checkPublicSuffix("http://test.ck", null);
            checkPublicSuffix("http://b.test.ck", "b.test.ck");
            checkPublicSuffix("http://a.b.test.ck", "b.test.ck");
            checkPublicSuffix("http://www.ck", "www.ck");
            checkPublicSuffix("http://www.www.ck", "www.ck");
            // US K12.
            // checkPublicSuffix("us", null);
            checkPublicSuffix("http://test.us", "test.us");
            checkPublicSuffix("http://www.test.us", "test.us");
            // checkPublicSuffix("http://ak.us", null);
            checkPublicSuffix("http://test.ak.us", "test.ak.us");
            checkPublicSuffix("http://www.test.ak.us", "test.ak.us");
            // checkPublicSuffix("http://k12.ak.us", null);
            checkPublicSuffix("http://test.k12.ak.us", "test.k12.ak.us");
            checkPublicSuffix("http://www.test.k12.ak.us", "test.k12.ak.us");
            // IDN labels.
            // checkPublicSuffix("http://食狮.com.cn", "食狮.com.cn");
            // checkPublicSuffix("http://食狮.公司.cn", "食狮.公司.cn");
            // checkPublicSuffix("http://www.食狮.公司.cn", "食狮.公司.cn");
            // checkPublicSuffix("http://shishi.公司.cn", "shishi.公司.cn");
            // checkPublicSuffix("http://公司.cn", null);
            // checkPublicSuffix("http://食狮.中国", "食狮.中国");
            // checkPublicSuffix("http://www.食狮.中国", "食狮.中国");
            // checkPublicSuffix("http://shishi.中国", "shishi.中国");
            // checkPublicSuffix("中国", null);
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
