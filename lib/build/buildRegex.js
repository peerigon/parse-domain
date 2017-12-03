"use strict";

const fs = require("fs");
const path = require("path");

const txtPath = path.resolve(__dirname, "./tld.txt");
const regexPath = path.resolve(__dirname, "../tld.js");

console.log("Reading " + txtPath + " ...");

const txtContent = fs.readFileSync(txtPath, "utf8");
const icannContent = txtContent.slice(
    txtContent.indexOf("// ===BEGIN ICANN DOMAINS==="),
    txtContent.indexOf("// ===END ICANN DOMAINS===")
);
const privateContent = txtContent.slice(
    txtContent.indexOf("// ===BEGIN PRIVATE DOMAINS==="),
    txtContent.indexOf("// ===END PRIVATE DOMAINS===")
);
const icannTld = icannContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);
const privateTld = privateContent.replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^.]+")
    .slice(1, -1);
const src = [
    '"use strict";',
    "",
    "exports = module.exports = /\\.(" + icannTld + "|$" + privateTld + ")$/;",
    "exports.icann = /\\.(" + icannTld + ")$/;",
    "exports.private = /\\.(" + privateTld + ")$/;",
].join("\n");

console.log("Writing module at " + regexPath + " ...");

fs.writeFileSync(regexPath, src, "utf8");

console.log("Checking if it's valid JavaScript ...");

const regex = require(regexPath); // eslint-disable-line import/no-dynamic-require

if (regex instanceof RegExp === false) {
    throw new Error("Generated regex is not instanceof RegExp. Instead saw " + regex);
}

console.log("Regex is ok, exiting now");
