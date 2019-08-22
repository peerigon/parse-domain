"use strict";

const parse = require("../../lib/trie/parse");

describe("parse()", () => {
    describe("when called with ''", () => {
        test("returns a node with null as domain and no children", () => {
            const root = parse("");

            expect(root.domain).toBeNull();
            expect(root.children.size).toBe(0);
        });
    });
    describe("when called with 'a'", () => {
        test("adds 'a' as child of root", () => {
            const root = parse("a");

            expect(root.children.has("a")).toBe(true);
        });
        test("initializes 'a' with the correct domain and parent", () => {
            const root = parse("a");
            const a = root.children.get("a");

            expect(a.domain).toBe("a");
            expect(a.parent).toBe(root);
        });
    });
    describe("when called with 'a,b'", () => {
        test("adds 'a' and 'b' as child of root", () => {
            const root = parse("a,b");

            expect(root.children.has("a")).toBe(true);
            expect(root.children.has("b")).toBe(true);
        });
        test("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a,b");
            const b = root.children.get("b");

            expect(b.domain).toBe("b");
            expect(b.parent).toBe(root);
        });
    });
    describe("when called with 'a>b'", () => {
        test("adds 'a' as child of root and 'b' as child of 'a'", () => {
            const root = parse("a>b");

            expect(root.children.has("a")).toBe(true);
            expect(root.children.get("a").children.has("b")).toBe(true);
        });
        test("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a>b");
            const a = root.children.get("a");
            const b = a.children.get("b");

            expect(b.domain).toBe("b");
            expect(b.parent).toBe(a);
        });
    });
    describe("when called with 'a>b,c'", () => {
        test("adds 'b' and 'c' as child of 'a'", () => {
            const root = parse("a>b,c");
            const a = root.children.get("a");

            expect(a.children.has("b")).toBe(true);
            expect(a.children.has("c")).toBe(true);
        });
        test("initializes 'c' with the correct domain and parent", () => {
            const root = parse("a>b,c");
            const a = root.children.get("a");
            const c = a.children.get("c");

            expect(c.domain).toBe("c");
            expect(c.parent).toBe(a);
        });
    });
    describe("when called with 'a>b<c'", () => {
        test("adds 'b' as child of 'a' and 'c' as child of root", () => {
            const root = parse("a>b<c");
            const a = root.children.get("a");

            expect(a.children.has("b")).toBe(true);
            expect(root.children.has("c")).toBe(true);
        });
        test("initializes 'c' with the correct domain and parent", () => {
            const root = parse("a>b<c");
            const c = root.children.get("c");

            expect(c.domain).toBe("c");
            expect(c.parent).toBe(root);
        });
    });
    describe("when called with 'a|b'", () => {
        test("adds 'a' and 'b' as child of root", () => {
            const root = parse("a|b");

            expect(root.children.has("a")).toBe(true);
            expect(root.children.has("b")).toBe(true);
        });
        test("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a|b");
            const b = root.children.get("b");

            expect(b.domain).toBe("b");
            expect(b.parent).toBe(root);
        });
    });
    describe("when called with 'a>b|c'", () => {
        test("adds 'b' as child of 'a' and 'c' as child of root", () => {
            const root = parse("a>b|c");
            const a = root.children.get("a");

            expect(a.children.has("b")).toBe(true);
            expect(root.children.has("c")).toBe(true);
        });
    });
    describe("when called with 'a>b<a>d'", () => {
        test("adds 'b' and 'd' as child of 'a'", () => {
            const root = parse("a>b<a>c");
            const a = root.children.get("a");

            expect(a.children.has("b")).toBe(true);
            expect(a.children.has("c")).toBe(true);
        });
    });
    describe("when called with 'a>b>c'", () => {
        test("adds 'c' as child of 'b'", () => {
            const root = parse("a>b>c");
            const b = root.children.get("a").children.get("b");

            expect(b.children.has("c")).toBe(true);
        });
    });
    describe("when called with 'a>b>c>d|e'", () => {
        test("adds 'e' as child node of root", () => {
            const node = parse("a>b>c>d|e");

            expect(node.children.has("e")).toBe(true);
        });
    });
});
