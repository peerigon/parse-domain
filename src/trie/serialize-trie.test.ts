import {readFileSync} from "fs";
import {resolve} from "path";
import {serializeTrie} from "./serialize-trie";
import {parsePublicSuffixList} from "../psl/parse-psl";

describe("serializeTrie()", () => {
	const pathToPslFixture = resolve(
		__dirname,
		"..",
		"tests",
		"fixtures",
		"public-suffix-list.txt",
	);

	const fixtureContent = readFileSync(pathToPslFixture, "utf8");

	test("When passed an empty array it returns an empty string", () => {
		expect(serializeTrie([])).toBe("");
	});

	test("It doesn't include duplicated lines", () => {
		expect(serializeTrie(["a.a", "a.a", "a.a"])).toBe("a>a");
	});

	test("It applies down separators as expected", () => {
		expect(serializeTrie(["a", "a.a", "a.a.a", "a.a.a.a"])).toBe("a>a>a>a");
	});

	test("It applies same level separators as expected", () => {
		expect(serializeTrie(["a.a", "b.a", "c.a"])).toBe("a>a,b,c");
	});

	test("It applies up separators as expected", () => {
		expect(serializeTrie(["a", "a.a", "a.a.a", "a.b.a", "a.c.a"])).toBe("a>a>a<b>a<c>a");
	});

	test("It applies reset separators as expected", () => {
		expect(serializeTrie(["a.a.a.a", "b.b.b", "c.c"])).toBe("a>a>a>a|b>b>b|c>c");
	});

	test("It also mixes separators", () => {
		expect(serializeTrie(["a.a.a.a", "b.a", "c.a", "a.a.b", "a.a.b.b", "b.a.b.b"])).toBe(
			"a>a>a>a<<b,c|b>a>a<b>a>a,b",
		);
	});

	test("The occurence order has no impact on the result", () => {
		expect(serializeTrie(["b.a.b.b", "c.a", "b.a", "a.a.a.a", "a.a.b", "a.a.b.b"])).toBe(
			"a>a>a>a<<b,c|b>a>a<b>a>a,b",
		);
	});

	test("The wildcard and the negation characters are not omitted", () => {
		expect(serializeTrie(["*.ck", "!www.ck"])).toBe("ck>!www,*");
	});

	test("It works with real-world use cases", () => {
		expect(serializeTrie(["uk", "ac.uk", "co.uk"])).toBe("uk>ac,co");
		expect(serializeTrie(["pl", "gov.pl", "ap.gov.pl"])).toBe("pl>gov>ap");
		expect(serializeTrie(["pl", "gov.pl", "ap.gov.pl", "uk", "ac.uk", "co.uk"])).toBe(
			"pl>gov>ap|uk>ac,co",
		);
	});

	test("It matches the snapshot when given the parsed test fixture", () => {
		const parsedFixture = parsePublicSuffixList(fixtureContent);

		expect(serializeTrie(parsedFixture.icann)).toMatchSnapshot();
		expect(serializeTrie(parsedFixture.private)).toMatchSnapshot();
	});
});
