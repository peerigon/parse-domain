"use strict";

var _LINE_FILTERS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SEPARATORS = require("./separators");

var TYPE_COMPLETE = "complete";
var TYPE_LIGHT = "light";
var POSSIBLE_TYPES = [TYPE_COMPLETE, TYPE_LIGHT];
var LINE_FILTERS = (_LINE_FILTERS = {}, _defineProperty(_LINE_FILTERS, TYPE_COMPLETE, function () {
  return true;
}), _defineProperty(_LINE_FILTERS, TYPE_LIGHT, function (line) {
  return line.length > 1;
}), _LINE_FILTERS);

function compareLinesAt(lineA, lineB, i) {
  var endOfLineA = i === lineA.length;
  var endOfLineB = i === lineB.length;

  if (endOfLineA || endOfLineB) {
    return lineA.length - lineB.length;
  }

  return lineA[i].localeCompare(lineB[i]) || compareLinesAt(lineA, lineB, i + 1);
}

function findIndexOfDifference(lineA, lineB) {
  var maxLength = Math.max(lineA.length, lineB.length);
  var i;

  for (i = 0; i < maxLength; i++) {
    if (lineA[i] !== lineB[i]) {
      return i;
    }
  }

  return -1;
}

function lineToString(line, i, arr) {
  var indexOfDifference = 0;
  var separatorFromPrev = "";

  if (i > 0) {
    var prevLine = arr[i - 1];
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
      separatorFromPrev = new Array(prevLine.length - indexOfDifference - 1).fill(SEPARATORS.UP).join("");
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
    throw new Error("Cannot serialize trie: Unknown trie type \"".concat(type, "\". Expected type to be one of ").concat(POSSIBLE_TYPES.map(JSON.stringify).join(", ")));
  }

  return parsedList.map(function (line) {
    return line.split(".");
  }).filter(LINE_FILTERS[type]).map(function (line) {
    return line.reverse();
  }).sort(function (lineA, lineB) {
    return compareLinesAt(lineA, lineB, 0);
  }).map(lineToString).join("");
}

serializeTrie.TYPE_COMPLETE = TYPE_COMPLETE;
serializeTrie.TYPE_LIGHT = TYPE_LIGHT;
module.exports = serializeTrie;