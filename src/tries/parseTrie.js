"use strict";

const SEPARATORS = require("./separators");

function parseTrie(input) {
    let map = new Map();
    const parentMaps = [map];
    let domain = "";

    function setDomain(value) {
        if (domain === "") {
            return;
        }
        map.set(domain, value);
        domain = "";
    }

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        switch (char) {
            case SEPARATORS.SAME: {
                setDomain(true);
                continue;
            }
            case SEPARATORS.DOWN: {
                const childMap = new Map();

                setDomain(childMap);
                parentMaps.push(map);
                map = childMap;
                continue;
            }
            case SEPARATORS.RESET: {
                setDomain(true);
                // Remove all parent maps but the top most
                parentMaps.length = 1;
                map = parentMaps[0];
                continue;
            }
            case SEPARATORS.UP: {
                setDomain(true);
                map = parentMaps.pop();
                continue;
            }
        }

        domain += char;
    }

    setDomain(true);

    return parentMaps[0];
}

module.exports = parseTrie;
