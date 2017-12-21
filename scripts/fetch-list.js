"use strict";

const fs = require("fs");
const path = require("path");
const got = require("got");
const childProcess = require("child_process");
const parsePubSuffixList = require("../lib/trie/parsePubSuffixList");
const serializeTrie = require("../lib/trie/serializeTrie");

const PUBLIC_SUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const rootPath = path.resolve(__dirname, "..");
const defaultListPath = path.resolve(rootPath, "build", "lists");
const listsPath = process.argv.length > 2 ? path.resolve(process.cwd(), process.argv[2]) : defaultListPath;

process.stdout.write(`Downloading public suffix list from ${ PUBLIC_SUFFIX_URL }... `);

got(PUBLIC_SUFFIX_URL)
    .then(res => {
        console.log("ok");

        return res.body;
    })
    .then(parsePubSuffixList)
    .then(parsed =>
        Object.keys(parsed)
            .map(listName => {
                const listPath = path.resolve(listsPath, listName + ".json");
                const parsedList = parsed[listName];

                return {
                    path: listPath,
                    content: JSON.stringify({
                        updatedAt: new Date().toISOString(),
                        trie: serializeTrie(parsedList),
                    }),
                };
            })
            .forEach(file => {
                process.stdout.write(`Writing ${ file.path }... `);
                fs.writeFileSync(file.path, file.content, "utf8");
                console.log("ok");
            })
    )
    .then(() => {
        process.stdout.write("Running sanity check... ");
        childProcess.execSync("npm run test:after-fetch", {
            cwd: rootPath,
            encoding: "utf8",
        });
        console.log("ok");
    })
    .catch(err => {
        const prebuiltListPath = path.resolve(defaultListPath, "icann.json");
        let exitCode = 1;

        console.error("");
        console.error("Could not update list of known top-level domains for parse-domain.");
        console.error(err.stack);

        try {
            const prebuiltList = JSON.parse(fs.readFileSync(prebuiltListPath));

            console.error("Using possibly outdated prebuilt list from " + prebuiltList.updatedAt);
            // Since this is not a critical error, we exit with a zero exit code
            exitCode = 0;
        } catch (_) {
            // Can be ignored here since we're exiting with a previous error anyway
        }
        process.exit(exitCode); // eslint-disable-line no-process-exit
    });
