"use strict";

const fs = require("fs");
const path = require("path");
const got = require("got");

const PUBLIC_SUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const listsPath = path.resolve(__dirname, "../lists");
const lists = [
    {
        name: "icann",
        markers: {
            begin: "// ===BEGIN ICANN DOMAINS===",
            end: "// ===END ICANN DOMAINS===",
        },
    },
    {
        name: "private",
        markers: {
            begin: "// ===BEGIN PRIVATE DOMAINS===",
            end: "// ===END PRIVATE DOMAINS===",
        },
    },
];

console.log(`GET ${ PUBLIC_SUFFIX_URL }`);
got(PUBLIC_SUFFIX_URL).then(res => res.body)
    .then(body => {
        lists.map(part => body.slice(
            body.indexOf(part.markers.begin),
            body.indexOf(part.markers.end)
        )).map(slice => slice.replace(/(\/\/.+)\r?\n/gi, "")
            .replace(/[\r?\n]+/g, "|")
            .replace(/\./g, "\\.")
            .replace(/\*/g, "[^.]+")
            .slice(1, -1))
            .map(list => `"use strict";
    
    module.exports = /\\.(${ list })$/;`)
            .map((src, i) => {
                const listName = lists[i].name;
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

                const regex = require(file.path); // eslint-disable-line import/no-dynamic-require

                if (regex instanceof RegExp === false) {
                    throw new Error("Generated regex is not instanceof RegExp. Instead saw " + regex);
                }
            });

        console.log("All list regexes are ok");
    });
