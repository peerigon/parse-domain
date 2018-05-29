"use strict";

const SEPARATORS = require("./separators");

const TYPE_COMPLETE = "complete";
const TYPE_LIGHT = "light";
const POSSIBLE_TYPES = [TYPE_COMPLETE, TYPE_LIGHT];
const LINE_FILTERS = {
    [TYPE_COMPLETE]: () => true,
    [TYPE_LIGHT]: line => line.length > 1,
};

function compareLinesAt(lineA, lineB, i) {
    const endOfLineA = i === lineA.length;
    const endOfLineB = i === lineB.length;

    if (endOfLineA || endOfLineB) {
        return lineA.length - lineB.length;
    }

    return lineA[i].localeCompare(lineB[i]) || compareLinesAt(lineA, lineB, i + 1);
}

function findIndexOfDifference(lineA, lineB) {
    const maxLength = Math.max(lineA.length, lineB.length);
    let i;

    for (i = 0; i < maxLength; i++) {
        if (lineA[i] !== lineB[i]) {
            return i;
        }
    }

    return -1;
}

function lineToString(line, i, arr) {
    let indexOfDifference = 0;
    let separatorFromPrev = "";

    if (i > 0) {
        const prevLine = arr[i - 1];

        indexOfDifference = findIndexOfDifference(line, prevLine);
        if (indexOfDifference === -1) {
            // Identical lines
            return "";
        }
        if (indexOfDifference === 0) {
            // line and prevLine are completely different
            separatorFromPrev = SEPARATORS.RESET;
        } else if (prevLine.length === line.length && indexOfDifference === line.length - 1) {
            // only the last part of line and prevLine are different
            separatorFromPrev = SEPARATORS.SAME;
        } else if (indexOfDifference > prevLine.length - 1) {
            // we don't need to go up the hierarchy first because prevLine is part of line
            // so let's just start with an initial down separator
            separatorFromPrev = SEPARATORS.DOWN;
        } else {
            // line and prevLine are different, but share a common root at indexOfDifference - 1
            // we now need to go up the hierarchy to the common root
            separatorFromPrev = new Array(prevLine.length - indexOfDifference - 1).fill(SEPARATORS.UP)
                .join("");
        }
    }

    return separatorFromPrev + line.slice(indexOfDifference).join(SEPARATORS.DOWN);
}

function serializeTrie(parsedList, type) {
    type = type || TYPE_COMPLETE;
    /**
     * parsedList looks like:
     * [
     *  "com",
     *  "co.uk",
     *  "gov.uk",
     *  "静岡.jp",
     *  "岐阜.jp",
     *  "موقع"
     * ]
     *
     * The resulting tree looks like this:
     * com      uk          jp         موقع
     *         /  \        /  \
     *       co   gov   静岡   岐阜
     *
     * And the textual representation of the trie looks like (using SEPARATORS):
     * com|uk>co,gov|jp>静岡,岐阜|موقع
     *
     * With type "light", all domains with no subdomain are excluded from the serialized trie:
     * uk>co,gov|jp>静岡,岐阜
     */

    if (POSSIBLE_TYPES.indexOf(type) === -1) {
        throw new Error(
            `Cannot serialize trie: Unknown trie type "${ type }". Expected type to be one of ${ POSSIBLE_TYPES.map(
                JSON.stringify
            ).join(", ") }`
        );
    }

    return parsedList
        .map(line => line.split("."))
        .filter(LINE_FILTERS[type])
        .map(line => line.reverse())
        .sort((lineA, lineB) => compareLinesAt(lineA, lineB, 0))
        .map(lineToString)
        .join("");
}

serializeTrie.TYPE_COMPLETE = TYPE_COMPLETE;
serializeTrie.TYPE_LIGHT = TYPE_LIGHT;

module.exports = serializeTrie;
