"use strict";

const chai = require("chai");
const parse = require("../../lib/trie/parse");

const expect = chai.expect;

describe("parse()", () => {
    describe("when called with ''", () => {
        it("returns a node with null as domain and no children", () => {
            const root = parse("");

            expect(root.domain).to.equal(null);
            expect(root.children.size).to.equal(0);
        });
    });
    describe("when called with 'a'", () => {
        it("adds 'a' as child of root", () => {
            const root = parse("a");

            expect(root.children.has("a")).to.be.true;
        });
        it("initializes 'a' with the correct domain and parent", () => {
            const root = parse("a");
            const a = root.children.get("a");

            expect(a.domain).to.equal("a");
            expect(a.parent).to.equal(root);
        });
    });
    describe("when called with 'a,b'", () => {
        it("adds 'a' and 'b' as child of root", () => {
            const root = parse("a,b");

            expect(root.children.has("a")).to.be.true;
            expect(root.children.has("b")).to.be.true;
        });
        it("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a,b");
            const b = root.children.get("b");

            expect(b.domain).to.equal("b");
            expect(b.parent).to.equal(root);
        });
    });
    describe("when called with 'a>b'", () => {
        it("adds 'a' as child of root and 'b' as child of 'a'", () => {
            const root = parse("a>b");

            expect(root.children.has("a")).to.be.true;
            expect(root.children.get("a").children.has("b")).to.be.true;
        });
        it("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a>b");
            const a = root.children.get("a");
            const b = a.children.get("b");

            expect(b.domain).to.equal("b");
            expect(b.parent).to.equal(a);
        });
    });
    describe("when called with 'a>b,c'", () => {
        it("adds 'b' and 'c' as child of 'a'", () => {
            const root = parse("a>b,c");
            const a = root.children.get("a");

            expect(a.children.has("b")).to.be.true;
            expect(a.children.has("c")).to.be.true;
        });
        it("initializes 'c' with the correct domain and parent", () => {
            const root = parse("a>b,c");
            const a = root.children.get("a");
            const c = a.children.get("c");

            expect(c.domain).to.equal("c");
            expect(c.parent).to.equal(a);
        });
    });
    describe("when called with 'a>b<c'", () => {
        it("adds 'b' as child of 'a' and 'c' as child of root", () => {
            const root = parse("a>b<c");
            const a = root.children.get("a");

            expect(a.children.has("b")).to.be.true;
            expect(root.children.has("c")).to.be.true;
        });
        it("initializes 'c' with the correct domain and parent", () => {
            const root = parse("a>b<c");
            const c = root.children.get("c");

            expect(c.domain).to.equal("c");
            expect(c.parent).to.equal(root);
        });
    });
    describe("when called with 'a|b'", () => {
        it("adds 'a' and 'b' as child of root", () => {
            const root = parse("a|b");

            expect(root.children.has("a")).to.be.true;
            expect(root.children.has("b")).to.be.true;
        });
        it("initializes 'b' with the correct domain and parent", () => {
            const root = parse("a|b");
            const b = root.children.get("b");

            expect(b.domain).to.equal("b");
            expect(b.parent).to.equal(root);
        });
    });
    describe("when called with 'a>b|c'", () => {
        it("adds 'b' as child of 'a' and 'c' as child of root", () => {
            const root = parse("a>b|c");
            const a = root.children.get("a");

            expect(a.children.has("b")).to.be.true;
            expect(root.children.has("c")).to.be.true;
        });
    });
    describe("when called with 'a>b<a>d'", () => {
        it("adds 'b' and 'd' as child of 'a'", () => {
            const root = parse("a>b<a>c");
            const a = root.children.get("a");

            expect(a.children.has("b")).to.be.true;
            expect(a.children.has("c")).to.be.true;
        });
    });
    describe("when called with 'a>b>c'", () => {
        it("adds 'c' as child of 'b'", () => {
            const root = parse("a>b>c");
            const b = root.children.get("a").children.get("b");

            expect(b.children.has("c")).to.be.true;
        });
    });
    describe("when called with 'a>b>c>d|e'", () => {
        it("adds 'e' as child node of root", () => {
            const node = parse("a>b>c>d|e");

            expect(node.children.has("e")).to.be.true;
        });
    });
});
