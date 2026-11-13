import { describe, expect, test } from "vitest";

import { expectChild, expectRoot } from "../tests/assertions/nodes.js";
import { createTrieFromList } from "./create-trie.js";

describe("createTrieFromList()", () => {
  test("when called with an empty array it returns just a root node with no children", () => {
    const root = createTrieFromList([]);

    expectRoot({ root, childrenSize: 0 });
  });

  test("when called with ['a'] it returns a root node with 'a' as child", () => {
    const root = createTrieFromList(["a"]);
    const a = root.children.get("a")!;

    expectRoot({ root, childrenSize: 1 });
    expectChild({ child: a, parent: root, domain: "a", childrenSize: 0 });
  });

  test("when called with ['a.b'] it returns a root node with 'b' as child and 'a' as child of 'b'", () => {
    const root = createTrieFromList(["a.b"]);
    const b = root.children.get("b")!;
    const a = b.children.get("a")!;

    expectRoot({ root, childrenSize: 1 });
    expectChild({ child: b, parent: root, domain: "b", childrenSize: 1 });
    expectChild({ child: a, parent: b, domain: "a", childrenSize: 0 });
  });

  test("when called with ['a', 'b'] it returns a root node with 'a' and 'b' as child", () => {
    const root = createTrieFromList(["a", "b"]);
    const a = root.children.get("a")!;
    const b = root.children.get("b")!;

    expectRoot({ root, childrenSize: 2 });
    expectChild({ child: a, parent: root, domain: "a", childrenSize: 0 });
    expectChild({ child: b, parent: root, domain: "b", childrenSize: 0 });
  });

  test("when called with ['a', 'a'] it returns a root node with just 'a' as child", () => {
    const root = createTrieFromList(["a", "a"]);
    const a = root.children.get("a")!;

    expectRoot({ root, childrenSize: 1 });
    expectChild({ child: a, parent: root, domain: "a", childrenSize: 0 });
  });

  test("when called with ['a.b', 'c.b'] it returns a root node with just 'b' as child and 'a' and 'c' as child of 'b'", () => {
    const root = createTrieFromList(["a.b", "c.b"]);
    const b = root.children.get("b")!;
    const a = b.children.get("a")!;
    const c = b.children.get("c")!;

    expectRoot({ root, childrenSize: 1 });
    expectChild({ child: b, parent: root, domain: "b", childrenSize: 2 });
    expectChild({ child: a, parent: b, domain: "a", childrenSize: 0 });
    expectChild({ child: c, parent: b, domain: "c", childrenSize: 0 });
  });

  test("marks only the last label of each rule as a rule, regardless of order", () => {
    for (const list of [
      ["a.b", "b"],
      ["b", "a.b"],
    ]) {
      const root = createTrieFromList(list);
      const b = root.children.get("b")!;

      expect(b.isRule).toBe(true);
      expect(b.children.get("a")!.isRule).toBe(true);
    }

    const root = createTrieFromList(["a.b"]);

    expect(root.children.get("b")!.isRule).toBe(false);
    expect(root.children.get("b")!.children.get("a")!.isRule).toBe(true);
  });
});
