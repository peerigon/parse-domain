"use strict";

const WILDCARD = "*";
const EXCEPTION = "!";

function lookUp(trie, hostname) {
    const domains = hostname.split(".").reverse();

    while (domains.length) {
        const domain = domains.pop();

        if (domains.length === 0) {
            return trie.has(domain) ? domain : null;
        }

        const joinedDomains = domains.join(".");
        const hasWildcardRule = trie.has(`${joinedDomains}.${WILDCARD}`);

        if (hasWildcardRule) {
            if (trie.has(`${joinedDomains}.${EXCEPTION}${domain}`)) {
                return domains.reverse().join(".");
            }

            return domains
                .concat(domain)
                .reverse()
                .join(".");
        }
        if (trie.has(`${joinedDomains}.${domain}`)) {
            return domains
                .concat(domain)
                .reverse()
                .join(".");
        }
    }

    return null;
}

module.exports = lookUp;
