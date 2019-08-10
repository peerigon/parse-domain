"use strict";

const chai = require("chai");
const {createNode, adoptChild} = require("../../lib/trie/nodes");

const expect = chai.expect;

describe("adoptChild()", () => {
    it("throws an error if the child has no domain", () => {
        expect(() => {
            adoptChild(createNode(), createNode());
        }).to.throw("Cannot adopt child: child.domain must be a string");
    });
    it("throws an error if the parent has already a child with that domain", () => {
        expect(() => {
            const parent = createNode();

            adoptChild(parent, createNode("some-domain"));
            adoptChild(parent, createNode("some-domain"));
        }).to.throw("Cannot adopt child: parent has already a child with the domain 'some-domain'");
    });
});
