import {parseDomain} from "./index";

test("It splits a hostname into subdomain, domain and top-level domain", () => {
	expect(parseDomain("www.example.com")).toEqual({
		subdomain: "www",
		domain: "example",
		tld: "com",
	});
});

test("It returns undefined as subdomain if the hostname has no subdomain", () => {
	expect(parseDomain("example.com")).toEqual({
		subdomain: undefined,
		domain: "example",
		tld: "com",
	});
});

test("It returns undefined as domain if the hostname is a top-level domain", () => {
	expect(parseDomain("com")).toEqual({
		subdomain: undefined,
		domain: undefined,
		tld: "com",
	});
});

test("It returns undefined as tld if the hostname does not contain a known top-level domain", () => {
	expect(parseDomain("does-not-exist")).toEqual({
		subdomain: undefined,
		domain: undefined,
		tld: undefined,
	});
});

test("It returns undefined as tld if the hostname does not contain a known top-level domain", () => {
	expect(parseDomain("does-not-exist")).toEqual({
		subdomain: undefined,
		domain: undefined,
		tld: undefined,
	});
});

test("It passes the official test suite from https://raw.githubusercontent.com/publicsuffix/list/master/tests/test_psl.txt", () => {
	const checkPublicSuffix = (hostname: string, domainDotTld: string | null): void => {
		const result = parseDomain(hostname);

		if (domainDotTld === null) {
			// When the expectedTld is null it means that the domain should not be registerable.
			// Our module should return undefined for the domain and the subdomain in that case.
			try {
				expect(result).toMatchObject({
					domain: undefined,
					subdomain: undefined,
				});
			} catch (error) {
				throw new Error(`Error with test hostname "${hostname}": ` + error.message);
			}
		} else {
			try {
				expect(result.domain + "." + result.tld).toBe(domainDotTld);
			} catch (error) {
				throw new Error(`Error with test hostname "${hostname}": ` + error.message);
			}
		}
	};

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
