import {parseTrie} from "./parse-trie";
import {NODE_TYPE_ROOT, NODE_TYPE_CHILD} from "./nodes";

describe("parseTrie()", () => {
	test("when called with '' it returns the root node with no children", () => {
		const root = parseTrie("");

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(0);
	});

	test("when called with 'a' it returns the root node with 'a' as the only child", () => {
		const root = parseTrie("a");

		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(1);
		expect(root.children.has("a")).toBe(true);
	});

	test("when called with 'a' it initializes 'a' with the correct properties", () => {
		const root = parseTrie("a");
		const a = root.children.get("a")!;

		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.domain).toBe("a");
		expect(a.parent).toBe(root);
	});

	test("when called with 'a,b' it adds both as children of root", () => {
		const root = parseTrie("a,b");

		expect(root.children.size).toBe(2);
		expect(root.children.has("a")).toBe(true);
		expect(root.children.has("b")).toBe(true);
	});

	test("when called with 'a,b' it initializes both with the correct properties", () => {
		const root = parseTrie("a,b");
		const a = root.children.get("a")!;

		expect(a.type).toBe(NODE_TYPE_CHILD);
		expect(a.domain).toBe("a");
		expect(a.parent).toBe(root);

		const b = root.children.get("b")!;

		expect(b.type).toBe(NODE_TYPE_CHILD);
		expect(b.domain).toBe("b");
		expect(b.parent).toBe(root);
	});

	test("when called with 'a>b' it adds 'b' as child of 'a'", () => {
		const root = parseTrie("a>b");

		expect(root.children.has("a")).toBe(true);
		expect(root.children.get("a")!.children.has("b")).toBe(true);
	});

	test("when called with 'a>b' it initializes 'b' with the correct properties", () => {
		const root = parseTrie("a>b");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;

		expect(b.type).toBe(NODE_TYPE_CHILD);
		expect(b.domain).toBe("b");
		expect(b.parent).toBe(a);
	});

	test("when called with 'a>b,c' it adds 'b' and 'c' as child of 'a'", () => {
		const root = parseTrie("a>b,c");
		const a = root.children.get("a")!;

		expect(a.children.has("b")).toBe(true);
		expect(a.children.has("c")).toBe(true);
	});

	test("when called with 'a>b,c' it initializes 'c' with the correct properties", () => {
		const root = parseTrie("a>b,c");
		const a = root.children.get("a")!;
		const c = a.children.get("c")!;

		expect(c.domain).toBe("c");
		expect(c.parent).toBe(a);
	});

	test("when called with 'a>b<c' it adds 'b' as child of 'a' and 'c' as child of root", () => {
		const root = parseTrie("a>b<c");
		const a = root.children.get("a")!;

		expect(a.children.has("b")).toBe(true);
		expect(root.children.has("c")).toBe(true);
	});

	test("when called with 'a>b<c' it initializes 'c' with the correct domain and parent", () => {
		const root = parseTrie("a>b<c");
		const c = root.children.get("c")!;

		expect(c.domain).toBe("c");
		expect(c.parent).toBe(root);
	});

	test("when called with 'a|b' it adds 'a' and 'b' as child of root", () => {
		const root = parseTrie("a|b");

		expect(root.children.has("a")).toBe(true);
		expect(root.children.has("b")).toBe(true);
	});

	test("when called with 'a|b' it initializes 'b' with the correct domain and parent", () => {
		const root = parseTrie("a|b");
		const b = root.children.get("b")!;

		expect(b.domain).toBe("b");
		expect(b.parent).toBe(root);
	});

	test("when called with 'a>b|c' it adds 'b' as child of 'a' and 'c' as child of root", () => {
		const root = parseTrie("a>b|c");
		const a = root.children.get("a")!;

		expect(a.children.has("b")).toBe(true);
		expect(root.children.has("c")).toBe(true);
	});

	test("when called with 'a>b<a>d' adds 'b' and 'd' as child of 'a'", () => {
		const root = parseTrie("a>b<a>c");
		const a = root.children.get("a")!;

		expect(a.children.has("b")).toBe(true);
		expect(a.children.has("c")).toBe(true);
	});

	test("when called with 'a>b>c' adds 'c' as child of 'b'", () => {
		const root = parseTrie("a>b>c");
		const b = root.children.get("a")!.children.get("b")!;

		expect(b.children.has("c")).toBe(true);
	});

	test("when called with 'a>b>c>d|e' adds 'e' as child node of root", () => {
		const node = parseTrie("a>b>c>d|e");

		expect(node.children.has("e")).toBe(true);
	});
});
