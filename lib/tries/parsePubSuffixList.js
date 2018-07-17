"use strict";

var matchNewLine = /\r?\n/;
var matchComments = /^\s*\/\//;
var matchWhitespace = /^\s*$/;
var lists = [{
  name: "icann",
  markers: {
    start: "// ===BEGIN ICANN DOMAINS===",
    end: "// ===END ICANN DOMAINS==="
  }
}, {
  name: "private",
  markers: {
    start: "// ===BEGIN PRIVATE DOMAINS===",
    end: "// ===END PRIVATE DOMAINS==="
  }
}];

function isWanted(line) {
  return matchComments.test(line) === false && matchWhitespace.test(line) === false;
}

function parsePubSuffixList(listContent) {
  return lists.map(function (list) {
    var start = listContent.indexOf(list.markers.start);
    var end = listContent.indexOf(list.markers.end);

    if (start === -1) {
      throw new Error("Missing start marker of ".concat(list.name, " list"));
    }

    if (end === -1) {
      throw new Error("Missing end marker of ".concat(list.name, " list"));
    }

    return listContent.slice(start, end);
  }).map(function (listContent) {
    return listContent.split(matchNewLine).filter(isWanted);
  }).reduce(function (result, lines, i) {
    var listName = lists[i].name;
    result[listName] = lines;
    return result;
  }, {});
}

module.exports = parsePubSuffixList;