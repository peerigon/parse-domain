"use strict";

var fs = require("fs"),
    path = require("path");

var tld,
    src;

tld = fs.readFileSync(__dirname + "/tld.txt", "utf8")
    .replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^\\.]*")
    .slice(1, -1);

src = "module.exports = /.(" + tld + ")$/;";

fs.writeFileSync(path.resolve(__dirname, "../tld.js"), src, "utf8");