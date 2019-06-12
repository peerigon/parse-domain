"use strict";

const characters = require("./characters");

class TrieNode {
    constructor(domain = null) {
        this.domain = domain;
        this.children = new Map();
    }
    add(domain) {
        let childNode = this.children.get(domain);

        if (childNode === undefined) {
            childNode = new TrieNode(domain);
            this.children.set(domain, childNode);
        }

        return childNode;
    }
    // Parsing is complex :)
    // eslint-disable-next-line complexity
    parse(serialized) {
        let input = serialized;
        let domain = "";

        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);

            switch (char) {
                case characters.SAME: {
                    this.add(domain);
                    domain = "";
                    continue;
                }
                case characters.DOWN: {
                    const childNode = this.add(domain);

                    domain = "";
                    input = childNode.parse(input.slice(i + 1));
                    i = -1;
                    continue;
                }
                case characters.RESET: {
                    if (this.domain === null) {
                        continue;
                    }
                    if (domain !== "") {
                        this.add(domain);
                    }

                    return input.slice(i);
                }
                case characters.UP: {
                    this.add(domain);

                    return input.slice(i + 1);
                }
            }

            domain += char;
        }

        if (domain !== "") {
            this.add(domain);
        }

        return "";
    }
    getRegisterableDomains(allDomains) {
        const domain = allDomains[allDomains.length - 1];

        if (this.children.has(characters.WILDCARD)) {
            if (this.children.has(characters.EXCEPTION + domain)) {
                return allDomains;
            }

            const wildcardNode = this.children.get(characters.WILDCARD);

            return wildcardNode.getRegisterableDomains(allDomains.slice(0, -1));
        }

        if (this.children.size === 0) {
            return allDomains;
        }

        const childNode = this.children.get(domain);

        return childNode === undefined ? [] : childNode.getRegisterableDomains(allDomains.slice(0, -1));
    }
}

module.exports = TrieNode;
