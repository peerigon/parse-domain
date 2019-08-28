import {parseTrie} from "./parse-trie";
import {NODE_TYPE_ROOT, NODE_TYPE_CHILD, TrieRootNode, TrieChildNode, TrieNode} from "./nodes";

describe("parseTrie()", () => {
	const expectRoot = ({root, childrenSize}: {root: TrieRootNode; childrenSize: number}) => {
		expect(root.type).toBe(NODE_TYPE_ROOT);
		expect(root.children.size).toBe(childrenSize);
	};

	const expectChild = ({
		child,
		parent,
		domain,
		childrenSize,
	}: {
		child: TrieChildNode;
		domain: string;
		childrenSize: number;
		parent: TrieNode;
	}) => {
		expect(child.type).toBe(NODE_TYPE_CHILD);
		expect(child.domain).toBe(domain);
		expect(child.children.size).toBe(childrenSize);
		expect(child.parent).toBe(parent);
	};

	test("when called with '' it returns the root node with no children", () => {
		const root = parseTrie("");

		expectRoot({root, childrenSize: 0});
	});

	test("when called with 'a' it returns the root node with 'a' as the only child", () => {
		const root = parseTrie("a");
		const a = root.children.get("a")!;

		expectRoot({root, childrenSize: 1});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 0});
	});

	test("when called with 'a,b' it adds both as children of root", () => {
		const root = parseTrie("a,b");
		const a = root.children.get("a")!;
		const b = root.children.get("b")!;

		expectRoot({root, childrenSize: 2});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 0});
		expectChild({child: b, parent: root, domain: "b", childrenSize: 0});
	});

	test("when called with 'a>b' it adds 'b' as child of 'a'", () => {
		const root = parseTrie("a>b");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;

		expectRoot({root, childrenSize: 1});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 1});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 0});
	});

	test("when called with 'a>b,c' it adds 'b' and 'c' as child of 'a'", () => {
		const root = parseTrie("a>b,c");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;
		const c = a.children.get("c")!;

		expectRoot({root, childrenSize: 1});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 2});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 0});
		expectChild({child: c, parent: a, domain: "c", childrenSize: 0});
	});

	test("when called with 'a>b<c' it adds 'b' as child of 'a' and 'c' as child of root", () => {
		const root = parseTrie("a>b<c");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;
		const c = root.children.get("c")!;

		expectRoot({root, childrenSize: 2});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 1});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 0});
		expectChild({child: c, parent: root, domain: "c", childrenSize: 0});
	});

	test("when called with 'a|b' it adds 'a' and 'b' as child of root", () => {
		const root = parseTrie("a|b");
		const a = root.children.get("a")!;
		const b = root.children.get("b")!;

		expectRoot({root, childrenSize: 2});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 0});
		expectChild({child: b, parent: root, domain: "b", childrenSize: 0});
	});

	test("when called with 'a>b|c' it adds 'b' as child of 'a' and 'c' as child of root", () => {
		const root = parseTrie("a>b|c");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;
		const c = root.children.get("c")!;

		expectRoot({root, childrenSize: 2});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 1});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 0});
		expectChild({child: c, parent: root, domain: "c", childrenSize: 0});
	});

	test("when called with 'a>b<a>d' adds 'b' and 'c' as child of 'a'", () => {
		const root = parseTrie("a>b<a>c");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;
		const c = a.children.get("c")!;

		expectRoot({root, childrenSize: 1});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 2});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 0});
		expectChild({child: c, parent: a, domain: "c", childrenSize: 0});
	});

	test("when called with 'a>b>c' adds 'c' as child of 'b'", () => {
		const root = parseTrie("a>b>c");
		const a = root.children.get("a")!;
		const b = a.children.get("b")!;
		const c = b.children.get("c")!;

		expectRoot({root, childrenSize: 1});
		expectChild({child: a, parent: root, domain: "a", childrenSize: 1});
		expectChild({child: b, parent: a, domain: "b", childrenSize: 1});
		expectChild({child: c, parent: b, domain: "c", childrenSize: 0});
	});

	test("when called with 'a>b>c>d|e' adds 'e' as child node of root", () => {
		const root = parseTrie("a>b>c>d|e");
		const e = root.children.get("e")!;

		expectRoot({root, childrenSize: 2});
		expectChild({child: e, parent: root, domain: "e", childrenSize: 0});
	});
});
