"use strict";

var fs = require("fs"),
    path = require("path");

var txtPath = path.resolve(__dirname, "./tld.txt"),
    regexPath = path.resolve(__dirname, "../tld.js");

console.log("Reading " + txtPath + " ...");

var txtContent = fs.readFileSync(txtPath, "utf8");

var icannContent = txtContent.slice(
    txtContent.indexOf('// ===BEGIN ICANN DOMAINS==='),
    txtContent.indexOf('// ===END ICANN DOMAINS===')
);
var privateContent = txtContent.slice(
    txtContent.indexOf('// ===BEGIN PRIVATE DOMAINS==='),
    txtContent.indexOf('// ===END PRIVATE DOMAINS===')
);

var icannTld = icannContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);
var privateTld = privateContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);

var src = `
    exports = module.exports = /\\.("${icannTld}|${privateTld}")$/;
    exports.icann = /\\.("${icannTld}")$/;
    exports.private = /\\.("${privateTld}")$/;
`

console.log("Writing module at " + regexPath + " ...");

fs.writeFileSync(regexPath, src, "utf8");

console.log("Checking if it's valid JavaScript ...");

var regex = require(regexPath);

if (regex instanceof RegExp === false) {
    throw new Error("Generated regex is not instanceof RegExp. Instead saw " + regex);
}

console.log("Regex is ok, exiting now");
