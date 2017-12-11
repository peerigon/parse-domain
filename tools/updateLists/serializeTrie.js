"use strict";

const HIERARCHY_DIRECTIONS = ["up", "same", "down"];
const SEPARATORS = {
    up: "<", // one level up
    same: ",", // same level
    down: ">", // one level down
    reset: "|", // reset level index and start new
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
    const length = Math.max(lineA.length, lineB.length);
    let i;

    for (i = 0; i < length; i++) {
        if (lineA[i] !== lineB[i]) {
            return i;
        }
    }

    return -1;
}

function getUpSeparators(indexOfDifference, prevLineLength) {
    const levelsToGoUp = Math.max(prevLineLength - indexOfDifference - 1, 0);

    return new Array(levelsToGoUp)
        .fill(SEPARATORS.up)
        .join("");
}

function pickSeparator(line, i, arr) {
    if (line.length < 2) {
        throw new Error("pickSeparator() works only on lines that have more elements than 1");
    }

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
            separatorFromPrev = SEPARATORS.reset;
        } else if (prevLine.length === line.length && indexOfDifference === line.length - 1) {
            separatorFromPrev = SEPARATORS.same;
        } else {
            separatorFromPrev = getUpSeparators(indexOfDifference, prevLine.length);
            if (prevLine.length < line.length && indexOfDifference === line.length - 1) {
                separatorFromPrev += SEPARATORS.down;
            }
        }
    }

    return separatorFromPrev + line.slice(indexOfDifference).join(SEPARATORS.down);
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
        .map(line => line.split("."))
        .filter(line => line.length > 1)
        .map(line => line.reverse())
        .sort((lineA, lineB) => compareLinesAt(lineA, lineB, 0))
        .map((line, i, arr) => pickSeparator(line, i, arr))
        .join("");
}

module.exports = serializeTrie;
