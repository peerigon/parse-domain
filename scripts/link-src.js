"use strict";

const fs = require("fs");
const path = require("path");

const rootFolder = path.resolve(__dirname, "..");

fs.symlinkSync(path.resolve(rootFolder, "src"), path.resolve(rootFolder, "lib"));