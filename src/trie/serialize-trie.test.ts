import {readFileSync} from "fs";
import {resolve} from "path";
import {serializeTrie} from "./serialize-trie";
import {parsePublicSuffixList} from "../psl/parse-psl";
import {createRootNode, createOrGetChild} from "./nodes";
import {createTrieFromList} from "./create-trie";

describe("serializeTrie()", () => {
	test("when passed a root node without children it returns an empty string", () => {
		const root = createRootNode();

		expect(serializeTrie(root)).toBe("");
	});

	test("uses down separators as expected", () => {
		const root = createRootNode();
		const a = createOrGetChild(root, "a");
		const b = createOrGetChild(a, "b");

		createOrGetChild(b, "c");

		expect(serializeTrie(root)).toMatchInlineSnapshot('"a>b>c"');
	});

	test("uses same level separators as expected", () => {
		const root = createRootNode();

		createOrGetChild(root, "a");
		createOrGetChild(root, "b");
		createOrGetChild(root, "c");

		expect(serializeTrie(root)).toMatchInlineSnapshot('"a,b,c"');
	});

	test("uses up separators as expected", () => {
		const root = createRootNode();
		const a = createOrGetChild(root, "a");

		createOrGetChild(a, "b");
		createOrGetChild(root, "c");

		expect(serializeTrie(root)).toMatchInlineSnapshot('"a>b<c"');
	});

	test("works with real-world use cases", () => {
		const root = createRootNode();
		const uk = createOrGetChild(root, "uk");
		const pl = createOrGetChild(root, "pl");
		const govPl = createOrGetChild(pl, "gov");

		createOrGetChild(uk, "ac");
		createOrGetChild(uk, "co");
		createOrGetChild(govPl, "ap");

		expect(serializeTrie(root)).toMatchInlineSnapshot('"uk>ac,co<pl>gov>ap"');
	});

	test("matches the snapshot when given the parsed test fixture", () => {
		const pathToPslFixture = resolve(
			__dirname,
			"..",
			"tests",
			"fixtures",
			"public-suffix-list.txt",
		);

		const fixtureContent = readFileSync(pathToPslFixture, "utf8");
		const parsedFixture = parsePublicSuffixList(fixtureContent);
		const icannTrie = createTrieFromList(parsedFixture.icann);
		const privateTrie = createTrieFromList(parsedFixture.icann);

		expect(serializeTrie(icannTrie)).toMatchSnapshot();
		expect(serializeTrie(privateTrie)).toMatchSnapshot();
	});
});
