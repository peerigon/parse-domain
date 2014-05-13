"use strict";

var fs = require("fs"),
    path = require("path");

var tld,
    template;

tld = fs.readFileSync(__dirname + "/tld.txt", "utf8")
    .replace(/(\/\/.+)\r?\n/gi, "")
    .replace(/[\r?\n]+/g, "|")
    .replace(/\./g, "\\.")
    .replace(/\*/g, "[^\\.]*")
    .slice(1, -1);

template = "module.exports = /.(" + tld + ")$/;";

fs.writeFileSync(path.resolve(__dirname, "../tld.js"), template, "utf8");