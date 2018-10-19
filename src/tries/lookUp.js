"use strict";

const WILDCARD = "*";
const EXCEPTION = "!";

function lookUp(trie, hostname) {
    const domains = hostname.split(".").reverse();
    const tlds = [];
    let currentTrie = trie;

    for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];
        const isWildcardRule = currentTrie.has(WILDCARD);

        if (isWildcardRule) {
            if (currentTrie.has(EXCEPTION + domain) === false) {
                tlds.push(domain);
            }
            break;
        }
        if (currentTrie.has(domain) === false) {
            break;
        }
        tlds.push(domain);

        const value = currentTrie.get(domain);

        if (value === true) {
            break;
        }
        currentTrie = value;
    }

    return tlds.length === 0 ? null : tlds.reverse().join(".");
}

module.exports = lookUp;
