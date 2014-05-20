"use strict";

var fs = require("fs"),
    path = require("path");

var txtPath = path.resolve(__dirname, "./tld.txt"),
    regexPath = path.resolve(__dirname, "../tld.js"),
    tld,
    src;

console.log("Reading " + txtPath + " ...");

tld = fs.readFileSync(txtPath, "utf8")
    .replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);

src = "module.exports = /\\.(" + tld + ")$/;";

console.log("Writing module at " + regexPath + " ...");

fs.writeFileSync(regexPath, src, "utf8");

console.log("Checking if it's valid JavaScript ...");

var regex = require(regexPath);

if (regex instanceof RegExp === false) {
    throw new Error("Generated regex is not instanceof RegExp. Instead saw " + regex);
}

console.log("Regex is ok, exiting now");