"use strict";

const characters = require("./characters.js");

function lookUp(trie, domains) {
    const domainsToCheck = domains.slice();
    const topLevel = [];
    let node = trie;

    while (domainsToCheck.length) {
        const domain = domainsToCheck.pop();

        if (node.children.has(characters.WILDCARD)) {
            if (node.children.has(characters.EXCEPTION + domain)) {
                break;
            }
            node = node.children.get(characters.WILDCARD);
        } else {
            if (node.children.has(domain) === false) {
                break;
            }
            node = node.children.get(domain);
        }

        topLevel.unshift(domain);
    }

    return topLevel;
}

module.exports = lookUp;
