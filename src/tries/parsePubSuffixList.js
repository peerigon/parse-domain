"use strict";

const matchNewLine = /\r?\n/;
const matchComments = /^\s*\/\//;
const matchWhitespace = /^\s*$/;
const lists = [
    {
        name: "icann",
        markers: {
            start: "// ===BEGIN ICANN DOMAINS===",
            end: "// ===END ICANN DOMAINS===",
        },
    },
    {
        name: "private",
        markers: {
            start: "// ===BEGIN PRIVATE DOMAINS===",
            end: "// ===END PRIVATE DOMAINS===",
        },
    },
];

function isWanted(line) {
    return matchComments.test(line) === false && matchWhitespace.test(line) === false;
}

function parsePubSuffixList(listContent) {
    return lists
        .map(list => {
            const start = listContent.indexOf(list.markers.start);
            const end = listContent.indexOf(list.markers.end);

            if (start === -1) {
                throw new Error(`Missing start marker of ${ list.name } list`);
            }
            if (end === -1) {
                throw new Error(`Missing end marker of ${ list.name } list`);
            }

            return listContent.slice(start, end);
        })
        .map(listContent => listContent.split(matchNewLine).filter(isWanted))
        .reduce((result, lines, i) => {
            const listName = lists[i].name;

            result[listName] = lines;

            return result;
        }, {});
}

module.exports = parsePubSuffixList;
