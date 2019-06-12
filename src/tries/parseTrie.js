"use strict";

const characters = require("./characters");

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
            case characters.SAME: {
                addCurrentDomainAsTld();
                continue;
            }
            case characters.DOWN: {
                const parentDomain = domain;

                addCurrentDomainAsTld();
                parentDomains.push(parentDomain);
                continue;
            }
            case characters.RESET: {
                addCurrentDomainAsTld();
                parentDomains = [];
                continue;
            }
            case characters.UP: {
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
