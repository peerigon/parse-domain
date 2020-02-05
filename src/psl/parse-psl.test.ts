import {readFileSync} from "fs";
import {resolve} from "path";
import {parsePublicSuffixList} from "./parse-psl";
import {
	PUBLIC_SUFFIX_MARKER_ICANN_START,
	PUBLIC_SUFFIX_MARKER_ICANN_END,
	PUBLIC_SUFFIX_MARKER_PRIVATE_START,
	PUBLIC_SUFFIX_MARKER_PRIVATE_END,
} from "../const";

describe("parsePublicSuffixList()", () => {
	const pathToPslFixture = resolve(
		__dirname,
		"..",
		"tests",
		"fixtures",
		"public-suffix-list.txt",
	);

	const fixtureContent = readFileSync(pathToPslFixture, "utf8");

	test("returns an object with empty lists by default", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			PUBLIC_SUFFIX_MARKER_ICANN_END,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		].join("\n");

		expect(parsePublicSuffixList(listContent)).toEqual({
			icann: [],
			private: [],
		});
	});

	test("splits the list by line break character \\n (ignoring \\r if present)", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			"a.b.c\r",
			"a",
			"b\r",
			PUBLIC_SUFFIX_MARKER_ICANN_END + "\r",
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			"a.b.c",
			"a",
			"b",
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		].join("\n");

		expect(parsePublicSuffixList(listContent)).toEqual({
			icann: ["a.b.c", "a", "b"],
			private: ["a.b.c", "a", "b"],
		});
	});

	test("removes lines that start with a // sequence", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			"// comment",
			"a.b.c",
			"a",
			"b",
			"//another comment",
			PUBLIC_SUFFIX_MARKER_ICANN_END,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			"a.b.c",
			"//",
			"a",
			" // ",
			"b",
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		].join("\n");

		expect(parsePublicSuffixList(listContent)).toEqual({
			icann: ["a.b.c", "a", "b"],
			private: ["a.b.c", "a", "b"],
		});
	});

	test("removes empty lines", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			" ",
			"a.b.c",
			" ",
			"a",
			"\r",
			PUBLIC_SUFFIX_MARKER_ICANN_END,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			"a.b.c",
			"\t",
			"b",
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		].join("\n");

		expect(parsePublicSuffixList(listContent)).toEqual({
			icann: ["a.b.c", "a"],
			private: ["a.b.c", "b"],
		});
	});

	test("normalizes rules (to punycode, to lower case)", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			" ",
			"大分",
			"ÄäÜü",
			PUBLIC_SUFFIX_MARKER_ICANN_END,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			"ÄäÜü",
			"大分",
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		].join("\n");

		expect(parsePublicSuffixList(listContent)).toEqual({
			icann: ["xn--kbrq7o", "xn--7ba2cxa1h"],
			private: ["xn--7ba2cxa1h", "xn--kbrq7o"],
		});
	});

	test("throws when the ICANN start marker is missing ", () => {
		const listContent = [""].join("\n");

		expect(() => parsePublicSuffixList(listContent)).toThrowError(
			`Missing start marker ${PUBLIC_SUFFIX_MARKER_ICANN_START} in public suffix list`,
		);
	});

	test("throws when the ICANN end marker is missing ", () => {
		const listContent = [PUBLIC_SUFFIX_MARKER_ICANN_START].join("\n");

		expect(() => parsePublicSuffixList(listContent)).toThrowError(
			`Missing end marker ${PUBLIC_SUFFIX_MARKER_ICANN_END} in public suffix list`,
		);
	});

	test("throws when the PRIVATE start marker is missing ", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			PUBLIC_SUFFIX_MARKER_ICANN_END,
		].join("\n");

		expect(() => parsePublicSuffixList(listContent)).toThrowError(
			`Missing start marker ${PUBLIC_SUFFIX_MARKER_PRIVATE_START} in public suffix list`,
		);
	});

	test("throws when the PRIVATE end marker is missing ", () => {
		const listContent = [
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			PUBLIC_SUFFIX_MARKER_ICANN_END,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
		].join("\n");

		expect(() => parsePublicSuffixList(listContent)).toThrowError(
			`Missing end marker ${PUBLIC_SUFFIX_MARKER_PRIVATE_END} in public suffix list`,
		);
	});

	test("matches the snapshot when given the test fixture", () => {
		const result = parsePublicSuffixList(fixtureContent);

		expect(result).toMatchSnapshot();
	});
});
