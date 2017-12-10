"use strict";

const SEPARATORS = [
    "<", // one level up
    ",", // same level
    ">", // one level down
];

function compareLinesAt(lineA, lineB, i) {
    const endOfLineA = i === lineA.length;
    const endOfLineB = i === lineB.length;

    if (endOfLineA || endOfLineB) {
        return lineA.length - lineB.length;
    }

    return lineA[i].localeCompare(lineB[i]) || compareLinesAt(lineA, lineB, i + 1);
}

function pickSeparator(line, i, arr) {
    if (i === 0) {
        return "";
    }

    const prevLine = arr[i - 1];

    return SEPARATORS[1 + Math.sign(line.length - prevLine.length)];
}

function longerThanOne(line) {
    return line !== undefined && line.length > 1;
}

function serializeTrie(parsedList) {
    /**
     * parsedList looks like:
     *
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
     *
     * com      uk          jp         موقع
     *         /  \        /  \
     *       co   gov   静岡   岐阜
     *
     * And the textual representation of the trie looks like (using SEPERATORS):
     *
     * com,uk>co,gov<jp>静岡,岐阜<موقع
     */
    return parsedList
        .map(line => line.split(".").reverse())
        .sort((lineA, lineB) => compareLinesAt(lineA, lineB, 0))
        .filter((line, i, arr) => longerThanOne(line) || longerThanOne(arr[i + 1]))
        .map((line, i, arr) => pickSeparator(line, i, arr) + line[line.length - 1])
        .join("");
}

module.exports = serializeTrie;
