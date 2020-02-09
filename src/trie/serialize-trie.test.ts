import {serializeTrie} from "./serialize-trie";
import {buildTries} from "../psl/build-tries";
import {createRootNode, createOrGetChild} from "./nodes";
import {readPslFixture} from "../tests/fixtures/fixtures";
import * as characters from "./characters";

const toReadableTrie = (serializedTrie: string) => {
	const pattern = new RegExp(
		`([\\${Object.values(characters).join("\\")}])`,
		"g",
	);

	return serializedTrie.replace(pattern, "\n$1");
};

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

	test("matches the snapshot when given the parsed test fixture", async () => {
		const fixtureContent = await readPslFixture();
		const {icannTrie, privateTrie} = buildTries(fixtureContent);

		expect(toReadableTrie(serializeTrie(icannTrie))).toMatchSnapshot();
		expect(toReadableTrie(serializeTrie(privateTrie))).toMatchSnapshot();
	});
});
