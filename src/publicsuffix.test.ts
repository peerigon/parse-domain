import { toASCII } from "punycode";
import { parseDomain, ParseResult, ParseResultType } from "./main";

describe("Official test suite from https://raw.githubusercontent.com/publicsuffix/list/master/tests/test_psl.txt", () => {
  const canonical = (hostname: string) =>
    new URL("http://" + hostname).hostname;

  const checkPublicSuffix = (
    hostname: string,
    // Unused because our parse result is more detailed than theirs
    publicSuffix: string | null,
    expectedParseResult: Partial<ParseResult>
  ) => {
    test(`${hostname} should be parsed to ${JSON.stringify(
      expectedParseResult
    )}`, () => {
      const canonicalHostname = canonical(hostname);
      const result = parseDomain(canonicalHostname);

      expect(result).toMatchObject(expectedParseResult);
    });
  };

  /* eslint-disable no-null/no-null */
  // Any copyright is dedicated to the Public Domain.
  // https://creativecommons.org/publicdomain/zero/1.0/

  // null input.
  // checkPublicSuffix(null, null);
  // Mixed case.
  checkPublicSuffix("COM", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("example.COM", "example.com", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "example",
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("WwW.example.COM", "example.com", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "example",
    topLevelDomains: ["com"],
  });
  // Leading dot.
  checkPublicSuffix(".com", null, {
    type: ParseResultType.Invalid,
  });
  checkPublicSuffix(".example", null, {
    type: ParseResultType.Invalid,
  });
  checkPublicSuffix(".example.com", null, {
    type: ParseResultType.Invalid,
  });
  checkPublicSuffix(".example.example", null, {
    type: ParseResultType.Invalid,
  });
  // Unlisted TLD.
  checkPublicSuffix("example", null, {
    type: ParseResultType.Reserved,
    labels: ["example"],
  });
  checkPublicSuffix("example.example", "example.example", {
    type: ParseResultType.Reserved,
    labels: ["example", "example"],
  });
  checkPublicSuffix("b.example.example", "example.example", {
    type: ParseResultType.Reserved,
    labels: ["b", "example", "example"],
  });
  checkPublicSuffix("a.b.example.example", "example.example", {
    type: ParseResultType.Reserved,
    labels: ["a", "b", "example", "example"],
  });
  // Listed, but non-Internet, TLD.
  checkPublicSuffix("local", null, {
    type: ParseResultType.Reserved,
    labels: ["local"],
  });
  checkPublicSuffix("example.local", null, {
    type: ParseResultType.Reserved,
    labels: ["example", "local"],
  });
  checkPublicSuffix("b.example.local", null, {
    type: ParseResultType.Reserved,
    labels: ["b", "example", "local"],
  });
  checkPublicSuffix("a.b.example.local", null, {
    type: ParseResultType.Reserved,
    labels: ["a", "b", "example", "local"],
  });
  // TLD with only 1 rule.
  checkPublicSuffix("biz", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["biz"],
  });
  checkPublicSuffix("domain.biz", "domain.biz", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "domain",
    topLevelDomains: ["biz"],
  });
  checkPublicSuffix("b.domain.biz", "domain.biz", {
    type: ParseResultType.Listed,
    subDomains: ["b"],
    domain: "domain",
    topLevelDomains: ["biz"],
  });
  checkPublicSuffix("a.b.domain.biz", "domain.biz", {
    type: ParseResultType.Listed,
    subDomains: ["a", "b"],
    domain: "domain",
    topLevelDomains: ["biz"],
  });
  // TLD with some 2-level rules.
  checkPublicSuffix("com", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("example.com", "example.com", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "example",
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("b.example.com", "example.com", {
    type: ParseResultType.Listed,
    subDomains: ["b"],
    domain: "example",
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("a.b.example.com", "example.com", {
    type: ParseResultType.Listed,
    subDomains: ["a", "b"],
    domain: "example",
    topLevelDomains: ["com"],
  });
  checkPublicSuffix("uk.com", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["uk", "com"],
  });
  checkPublicSuffix("example.uk.com", "example.uk.com", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "example",
    topLevelDomains: ["uk", "com"],
  });
  checkPublicSuffix("b.example.uk.com", "example.uk.com", {
    type: ParseResultType.Listed,
    subDomains: ["b"],
    domain: "example",
    topLevelDomains: ["uk", "com"],
  });
  checkPublicSuffix("a.b.example.uk.com", "example.uk.com", {
    type: ParseResultType.Listed,
    subDomains: ["a", "b"],
    domain: "example",
    topLevelDomains: ["uk", "com"],
  });
  checkPublicSuffix("test.ac", "test.ac", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["ac"],
  });
  // TLD with only 1 (wildcard) rule.
  checkPublicSuffix("mm", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["mm"],
  });
  checkPublicSuffix("c.mm", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["c", "mm"],
  });
  checkPublicSuffix("b.c.mm", "b.c.mm", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "b",
    topLevelDomains: ["c", "mm"],
  });
  checkPublicSuffix("a.b.c.mm", "b.c.mm", {
    type: ParseResultType.Listed,
    subDomains: ["a"],
    domain: "b",
    topLevelDomains: ["c", "mm"],
  });
  // More complex TLD.
  checkPublicSuffix("jp", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["jp"],
  });
  checkPublicSuffix("test.jp", "test.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["jp"],
  });
  checkPublicSuffix("www.test.jp", "test.jp", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "test",
    topLevelDomains: ["jp"],
  });
  checkPublicSuffix("ac.jp", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["ac", "jp"],
  });
  checkPublicSuffix("test.ac.jp", "test.ac.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["ac", "jp"],
  });
  checkPublicSuffix("www.test.ac.jp", "test.ac.jp", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "test",
    topLevelDomains: ["ac", "jp"],
  });
  checkPublicSuffix("kyoto.jp", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["kyoto", "jp"],
  });
  checkPublicSuffix("test.kyoto.jp", "test.kyoto.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["kyoto", "jp"],
  });
  checkPublicSuffix("ide.kyoto.jp", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["ide", "kyoto", "jp"],
  });
  checkPublicSuffix("b.ide.kyoto.jp", "b.ide.kyoto.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "b",
    topLevelDomains: ["ide", "kyoto", "jp"],
  });
  checkPublicSuffix("a.b.ide.kyoto.jp", "b.ide.kyoto.jp", {
    type: ParseResultType.Listed,
    subDomains: ["a"],
    domain: "b",
    topLevelDomains: ["ide", "kyoto", "jp"],
  });
  checkPublicSuffix("c.kobe.jp", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["c", "kobe", "jp"],
  });
  checkPublicSuffix("b.c.kobe.jp", "b.c.kobe.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "b",
    topLevelDomains: ["c", "kobe", "jp"],
  });
  checkPublicSuffix("a.b.c.kobe.jp", "b.c.kobe.jp", {
    type: ParseResultType.Listed,
    subDomains: ["a"],
    domain: "b",
    topLevelDomains: ["c", "kobe", "jp"],
  });
  checkPublicSuffix("city.kobe.jp", "city.kobe.jp", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "city",
    topLevelDomains: ["kobe", "jp"],
  });
  checkPublicSuffix("www.city.kobe.jp", "city.kobe.jp", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "city",
    topLevelDomains: ["kobe", "jp"],
  });
  // TLD with a wildcard rule and exceptions.
  checkPublicSuffix("ck", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["ck"],
  });
  checkPublicSuffix("test.ck", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["test", "ck"],
  });
  checkPublicSuffix("b.test.ck", "b.test.ck", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "b",
    topLevelDomains: ["test", "ck"],
  });
  checkPublicSuffix("a.b.test.ck", "b.test.ck", {
    type: ParseResultType.Listed,
    subDomains: ["a"],
    domain: "b",
    topLevelDomains: ["test", "ck"],
  });
  checkPublicSuffix("www.ck", "www.ck", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "www",
    topLevelDomains: ["ck"],
  });
  checkPublicSuffix("www.www.ck", "www.ck", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "www",
    topLevelDomains: ["ck"],
  });
  // US K12.
  checkPublicSuffix("us", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["us"],
  });
  checkPublicSuffix("test.us", "test.us", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["us"],
  });
  checkPublicSuffix("www.test.us", "test.us", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "test",
    topLevelDomains: ["us"],
  });
  checkPublicSuffix("ak.us", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["ak", "us"],
  });
  checkPublicSuffix("test.ak.us", "test.ak.us", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["ak", "us"],
  });
  checkPublicSuffix("www.test.ak.us", "test.ak.us", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "test",
    topLevelDomains: ["ak", "us"],
  });
  checkPublicSuffix("k12.ak.us", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: ["k12", "ak", "us"],
  });
  checkPublicSuffix("test.k12.ak.us", "test.k12.ak.us", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "test",
    topLevelDomains: ["k12", "ak", "us"],
  });
  checkPublicSuffix("www.test.k12.ak.us", "test.k12.ak.us", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: "test",
    topLevelDomains: ["k12", "ak", "us"],
  });
  // IDN labels.
  checkPublicSuffix("食狮.com.cn", "食狮.com.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: ["com", "cn"],
  });
  checkPublicSuffix("食狮.公司.cn", "食狮.公司.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("www.食狮.公司.cn", "食狮.公司.cn", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("shishi.公司.cn", "shishi.公司.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "shishi",
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("公司.cn", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("食狮.中国", "食狮.中国", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("www.食狮.中国", "食狮.中国", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("shishi.中国", "shishi.中国", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "shishi",
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("中国", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: [toASCII("中国")],
  });
  // Same as above, but punycoded.
  checkPublicSuffix("xn--85x722f.com.cn", "xn--85x722f.com.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: ["com", "cn"],
  });
  checkPublicSuffix("xn--85x722f.xn--55qx5d.cn", "xn--85x722f.xn--55qx5d.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix(
    "www.xn--85x722f.xn--55qx5d.cn",
    "xn--85x722f.xn--55qx5d.cn",
    {
      type: ParseResultType.Listed,
      subDomains: ["www"],
      domain: toASCII("食狮"),
      topLevelDomains: [toASCII("公司"), "cn"],
    }
  );
  checkPublicSuffix("shishi.xn--55qx5d.cn", "shishi.xn--55qx5d.cn", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "shishi",
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("xn--55qx5d.cn", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: [toASCII("公司"), "cn"],
  });
  checkPublicSuffix("xn--85x722f.xn--fiqs8s", "xn--85x722f.xn--fiqs8s", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("www.xn--85x722f.xn--fiqs8s", "xn--85x722f.xn--fiqs8s", {
    type: ParseResultType.Listed,
    subDomains: ["www"],
    domain: toASCII("食狮"),
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("shishi.xn--fiqs8s", "shishi.xn--fiqs8s", {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: "shishi",
    topLevelDomains: [toASCII("中国")],
  });
  checkPublicSuffix("xn--fiqs8s", null, {
    type: ParseResultType.Listed,
    subDomains: [],
    domain: undefined,
    topLevelDomains: [toASCII("中国")],
  });
  /* eslint-enable no-null/no-null */
});
