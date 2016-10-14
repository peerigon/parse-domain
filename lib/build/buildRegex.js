"use strict";

var fs = require("fs");
var path = require("path");

var txtPath = path.resolve(__dirname, "./tld.txt");
var regexPath = path.resolve(__dirname, "../tld.js");
var txtContent;
var icannContent;
var privateContent;
var icannTld;
var privateTld;
var src;
var regex;

console.log("Reading " + txtPath + " ...");

txtContent = fs.readFileSync(txtPath, "utf8");

icannContent = txtContent.slice(
    txtContent.indexOf("// ===BEGIN ICANN DOMAINS==="),
    txtContent.indexOf("// ===END ICANN DOMAINS===")
);
privateContent = txtContent.slice(
    txtContent.indexOf("// ===BEGIN PRIVATE DOMAINS==="),
    txtContent.indexOf("// ===END PRIVATE DOMAINS===")
);

icannTld = icannContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);
privateTld = privateContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);

src = [
    "exports = module.exports = /\\.(" + icannTld + "|$" + privateTld + ")$/;",
    "exports.icann = /\\.(" + icannTld + ")$/;",
    "exports.private = /\\.(" + privateTld + ")$/;"
].join("\n");

console.log("Writing module at " + regexPath + " ...");

fs.writeFileSync(regexPath, src, "utf8");

console.log("Checking if it's valid JavaScript ...");

regex = require(regexPath);

if (regex instanceof RegExp === false) {
    throw new Error("Generated regex is not instanceof RegExp. Instead saw " + regex);
}

console.log("Regex is ok, exiting now");
