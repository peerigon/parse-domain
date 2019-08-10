"use strict";

function createNode(domain = null) {
    return {
        domain,
        children: new Map(),
        parent: null,
    };
}

function createOrGetChild(parent, domain) {
    let child = parent.children.get(domain);

    if (child === undefined) {
        child = createNode(domain);
        adoptChild(parent, child);
    }

    return child;
}

function adoptChild(parent, child) {
    if (typeof child.domain !== "string") {
        throw new Error("Cannot adopt child: child.domain must be a string");
    }
    if (parent.children.has(child.domain)) {
        throw new Error(`Cannot adopt child: parent has already a child with the domain '${child.domain}'`);
    }
    parent.children.set(child.domain, child);
    child.parent = parent;
}

module.exports = {
    createNode,
    createOrGetChild,
    adoptChild,
};
