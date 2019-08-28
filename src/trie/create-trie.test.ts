import {createTrieFromList} from "./create-trie";
import {NODE_TYPE_ROOT, NODE_TYPE_CHILD} from "./nodes";

describe("createTrieFromList()", () => {
	test("when called with an empty array it returns just a root node with no children", () => {
		const root = createTrieFromList([]);
		
		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(0);
	});

	test("when called with ['a'] it returns a root node with 'a' as child", () => {
		const root = createTrieFromList(["a"]);
		const a = root.children.get("a")!;

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(1);
		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.children.size).toBe(0);
	});

	test("when called with ['a.b'] it returns a root node with 'b' as child and 'a' as child of 'b'", () => {
		const root = createTrieFromList(["a.b"]);
		const b = root.children.get("b")!;
		const a = b.children.get("a")!;

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(1);
		expect(b.type).toBe(NODE_TYPE_CHILD);
		expect(b.children.size).toBe(1);
		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.children.size).toBe(0);
	});

	test("when called with ['a', 'b'] it returns a root node with 'a' and 'b' as child", () => {
		const root = createTrieFromList(["a", "b"]);
		const a = root.children.get("a")!;
		const b = root.children.get("b")!;

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(2);
		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.children.size).toBe(0);
		expect(b.type).toBe(NODE_TYPE_CHILD);
		expect(b.children.size).toBe(0);
	});

	test("when called with ['a', 'a'] it returns a root node with just 'a' as child", () => {
		const root = createTrieFromList(["a", "a"]);
		const a = root.children.get("a")!;

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(1);
		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.children.size).toBe(0);
	});

	test("when called with ['a.b', 'c.b'] it returns a root node with just 'b' as child and 'a' and 'c' as child of 'b'", () => {
		const root = createTrieFromList(['a.b', 'c.b']);
		const b = root.children.get("b")!;
		const a = b.children.get("a")!;
		const c = b.children.get("c")!;

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(1);
		expect(b.type).toBe(NODE_TYPE_CHILD);
		expect(b.children.size).toBe(2);
		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.children.size).toBe(0);
		expect(c.type).toBe(NODE_TYPE_CHILD);
		expect(c.children.size).toBe(0);
	});
});
