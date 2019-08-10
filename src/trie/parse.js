"use strict";

const characters = require("./characters");
const {createNode, createOrGetChild} = require("./nodes");

// Parsing is complex... :)
// eslint-disable-next-line complexity
function parse(serialized) {
    const rootNode = createNode();
    let domain = "";
    let parentNode = rootNode;
    let node;

    function addDomain() {
        node = createOrGetChild(parentNode, domain);
        domain = "";
    }

    for (let i = 0; i < serialized.length; i++) {
        const char = serialized.charAt(i);

        switch (char) {
            case characters.SAME: {
                addDomain();
                continue;
            }
            case characters.DOWN: {
                addDomain();
                parentNode = node;
                continue;
            }
            case characters.RESET: {
                addDomain();
                parentNode = rootNode;
                continue;
            }
            case characters.UP: {
                addDomain();
                parentNode = parentNode.parent;
                continue;
            }
        }
        domain += char;
    }

    if (domain !== "") {
        addDomain();
    }

    return rootNode;
}

module.exports = parse;
