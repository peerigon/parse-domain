"use strict";

const {createNode, adoptChild} = require("../../lib/trie/nodes");

describe("adoptChild()", () => {
    test("throws an error if the child has no domain", () => {
        expect(() => {
            adoptChild(createNode(), createNode());
        }).toThrowError("Cannot adopt child: child.domain must be a string");
    });
    test(
        "throws an error if the parent has already a child with that domain",
        () => {
            expect(() => {
                const parent = createNode();

                adoptChild(parent, createNode("some-domain"));
                adoptChild(parent, createNode("some-domain"));
            }).toThrowError(
                "Cannot adopt child: parent has already a child with the domain 'some-domain'"
            );
        }
    );
});
