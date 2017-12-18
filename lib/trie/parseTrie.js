"use strict";

const SEPARATORS = require("./separators");

function parseList(input) {
    let map = new Map();
    const parentMaps = [map];
    let token = "";

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        switch (char) {
            case SEPARATORS.SAME: {
                map.set(token, true);
                token = "";
                continue;
            }
            case SEPARATORS.DOWN: {
                const parentMap = map;

                map = new Map();
                parentMaps.push(parentMap);
                parentMap.set(token, map);
                token = "";
                continue;
            }
            case SEPARATORS.RESET: {
                map.set(token, true);
                // Remove all parent maps but the top most
                parentMaps.length = 1;
                map = parentMaps[0];
                token = "";
                continue;
            }
            case SEPARATORS.UP: {
                map.set(token, true);
                map = parentMaps.pop();
                token = "";
                continue;
            }
        }

        token += char;
    }

    map.set(token, true);

    return parentMaps[0];
}

module.exports = parseList;