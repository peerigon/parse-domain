"use strict";

function compareLinesAt(lineA, lineB, i) {
    const a = lineA[i];
    const b = lineB[i];

    if (i === lineA.length || i === lineB.length) {
        return lineA.length - lineB.length;
    }

    return a.localeCompare(b) || compareLinesAt(lineA, lineB, i + 1);
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
     * And the textual representation of the trie looks like:
     *
     * com
     * uk
     *  co
     *  gov
     * jp
     *  静岡
     *  岐阜
     * موقع
     */
    return parsedList
        .map(line => line.split(".").reverse())
        .sort((lineA, lineB) => compareLinesAt(lineA, lineB, 0))
        .map(line => line.map((part, i) => (i === line.length - 1 ? part : " ")).join(""))
        .join("|");
}

module.exports = serializeTrie;
