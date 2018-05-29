"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const copySync = require("fs-copy-file-sync");
const mkdirp = require("mkdirp");

const rootPath = path.resolve(__dirname, "..");
const triesPath = path.resolve(rootPath, "build", "tries", "current");
const triesPrePath = path.resolve(rootPath, "build", "tries", "pre");

process.stderr.write("Writing prebuilt lists... ");
mkdirp.sync(triesPrePath);
fs.readdirSync(triesPath).forEach(file => {
    const src = path.resolve(triesPath, file);
    const dest = path.resolve(triesPrePath, file);

    copySync(src, dest);
});
process.stderr.write("ok" + os.EOL);