"use strict";

const chai = require("chai");
const TrieNode = require("../../src/tries/TrieNode");

const expect = chai.expect;

describe("Trie", () => {
    describe(".constructor()", () => {
        it("initializes .children with a map", () => {
            const trie = new TrieNode();

            expect(trie.children).to.be.instanceOf(Map);
        });
        describe("when called with no arguments", () => {
            it("initializes .domain to null", () => {
                const trie = new TrieNode();

                expect(trie.domain).to.equal(null);
            });
        });
        describe("when called with a domain", () => {
            it("initializes .domain with the given domain", () => {
                const trie = new TrieNode("a");

                expect(trie.domain).to.equal("a");
            });
        });
    });
    describe(".add()", () => {
        // TODO: Create tests
    });
    describe(".parse()", () => {
        describe("when called with 'a'", () => {
            it("adds 'a' as child node", () => {
                const node = new TrieNode();

                node.parse("a");

                expect(node.children.has("a")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a,b'", () => {
            it("adds 'a' and 'b' as child node", () => {
                const node = new TrieNode();

                node.parse("a,b");

                expect(node.children.has("a")).to.be.true;
                expect(node.children.has("b")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a,b");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b'", () => {
            it("adds 'a' as child node and 'b' as sub child node", () => {
                const node = new TrieNode();

                node.parse("a>b");

                expect(node.children.has("a")).to.be.true;
                expect(node.children.get("a").children.has("b")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a<b'", () => {
            it("adds 'a' as child node", () => {
                const node = new TrieNode();

                node.parse("a<b");

                expect(node.children.has("a")).to.be.true;
            });
            it("returns 'b'", () => {
                const node = new TrieNode();
                const returned = node.parse("a<b");

                expect(returned).to.equal("b");
            });
        });
        describe("when called with 'a|b' and .domain is not null", () => {
            it("adds 'a' as child node", () => {
                const node = new TrieNode("c");

                node.parse("a|b");

                expect(node.children.has("a")).to.be.true;
            });
            it("returns '|b'", () => {
                const node = new TrieNode("c");
                const returned = node.parse("a|b");

                expect(returned).to.equal("|b");
            });
        });
        describe("when called with 'a>b,c'", () => {
            it("adds 'b' and 'c' as sub child node", () => {
                const node = new TrieNode();

                node.parse("a>b,c");

                const a = node.children.get("a");

                expect(a.children.has("b")).to.be.true;
                expect(a.children.has("c")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b,c");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b<c'", () => {
            it("adds 'c' as child node", () => {
                const node = new TrieNode();

                node.parse("a>b<c");

                expect(node.children.has("c")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b<c");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b<a>c'", () => {
            it("adds 'b' and 'c' as sub child node", () => {
                const node = new TrieNode();

                node.parse("a>b<a>c");

                const a = node.children.get("a");

                expect(a.children.has("b")).to.be.true;
                expect(a.children.has("c")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b<a>c");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b|c'", () => {
            it("adds 'c' as child node", () => {
                const node = new TrieNode();

                node.parse("a>b|c");

                expect(node.children.has("c")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b|c");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b>c'", () => {
            it("adds 'c' as sub sub child node", () => {
                const node = new TrieNode();

                node.parse("a>b>c");

                const b = node.children.get("a").children.get("b");

                expect(b.children.has("c")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b>c");

                expect(returned).to.equal("");
            });
        });
        describe("when called with 'a>b>c>d|e'", () => {
            it("adds 'e' as child node", () => {
                const node = new TrieNode();

                node.parse("a>b>c>d|e");

                expect(node.children.has("e")).to.be.true;
            });
            it("returns ''", () => {
                const node = new TrieNode();
                const returned = node.parse("a>b>c>d|e");

                expect(returned).to.equal("");
            });
        });
    });
    describe(".getRegisterableDomains()", () => {
        describe("when initialized with 'com,net,org'", () => {
            let node;

            beforeEach(() => {
                node = new TrieNode();
                node.parse("com,net,org");
            });

            it("returns ['www', 'example'] for ['www', 'example', 'com']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "com"]);

                expect(returned).to.eql(["www", "example"]);
            });
            it("returns ['www', 'example'] for ['www', 'example', 'net']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "net"]);

                expect(returned).to.eql(["www", "example"]);
            });
            it("returns [] for ['www', 'example', 'de']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "de"]);

                expect(returned).to.eql([]);
            });
        });
        describe("when initialized with 'uk>co'", () => {
            let node;

            beforeEach(() => {
                node = new TrieNode();
                node.parse("uk>co");
            });

            it("returns ['www', 'example'] for ['www', 'example', 'co', 'uk']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "co", "uk"]);

                expect(returned).to.eql(["www", "example"]);
            });
            it("returns [] for ['www', 'example', 'x', 'uk']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "x", "uk"]);

                expect(returned).to.eql([]);
            });
        });
        describe("when initialized with '*,!net'", () => {
            let node;

            beforeEach(() => {
                node = new TrieNode();
                node.parse("*,!net");
            });

            it("returns ['www', 'example'] for ['www', 'example', 'com']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "com"]);

                expect(returned).to.eql(["www", "example"]);
            });
            it("returns ['www', 'example', 'net'] for ['www', 'example', 'net']", () => {
                const returned = node.getRegisterableDomains(["www", "example", "net"]);

                expect(returned).to.eql(["www", "example", "net"]);
            });
        });
    });
});
