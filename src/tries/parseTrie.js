"use strict";

const SEPARATORS = require("./separators");

function parseTrie(input) {
    const tlds = new Set();
    let parentDomains = [];
    let domain = "";

    function addCurrentDomainAsTld() {
        if (domain === "") {
            return;
        }
        tlds.add(parentDomains.concat(domain).join("."));
        domain = "";
    }

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        switch (char) {
            case SEPARATORS.SAME: {
                addCurrentDomainAsTld();
                continue;
            }
            case SEPARATORS.DOWN: {
                const parentDomain = domain;

                addCurrentDomainAsTld();
                parentDomains.push(parentDomain);
                continue;
            }
            case SEPARATORS.RESET: {
                addCurrentDomainAsTld();
                parentDomains = [];
                continue;
            }
            case SEPARATORS.UP: {
                addCurrentDomainAsTld();
                parentDomains.pop();
                continue;
            }
        }

        domain += char;
    }

    addCurrentDomainAsTld();

    return tlds;
}

module.exports = parseTrie;
