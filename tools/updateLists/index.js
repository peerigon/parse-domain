"use strict";

const fs = require("fs");
const path = require("path");
const got = require("got");
const parsePSList = require("./parsePSList");
const serializeTrie = require("./serializeTrie");

const PUBLIC_SUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const listsPath = path.resolve(__dirname, "../../lib/lists");

// Check if listsPath is available
fs.accessSync(listsPath);

console.log(`GET ${ PUBLIC_SUFFIX_URL }`);
got(PUBLIC_SUFFIX_URL).then(res => res.body)
    .then(parsePSList)
    .then(parsed => Object.keys(parsed).map(listName => {
        const trieStr = serializeTrie(parsed[listName]);
        const src = `"use strict";

module.exports = ${ JSON.stringify(trieStr) };`;
        const listPath = path.resolve(listsPath, listName + ".js");

        return {
            path: listPath,
            content: src,
        };
    })
        .forEach(file => {
            console.log(`Writing list module at ${ file.path }...`);
            fs.writeFileSync(file.path, file.content, "utf8");
            console.log("Checking if it's valid JavaScript...");

            const string = require(file.path); // eslint-disable-line import/no-dynamic-require

            if (typeof string !== "string") {
                throw new Error("Serialized list is not typeof string, instead saw " + string);
            }
        }))
    .catch(err => {
        console.error(err);
        process.exit(1); // eslint-disable-line no-process-exit
    });
