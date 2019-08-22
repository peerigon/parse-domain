"use strict";

// Disabling promise ESLint rules because we can't use async/await here
// before all supported Node versions support it.
/* eslint-disable promise/always-return, promise/prefer-await-to-callbacks */

const os = require("os");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const got = require("got");
const mkdirp = require("mkdirp");

try {
    require.resolve("../lib/trie/parsePubSuffixList");
} catch (error) {
    // This conditions occurs when the CI system or a developer checks out the repo for the first time.
    // It happens because the postinstall hook kicks in *before* the lib is built.
    // In that case, it's safe to just skip the step.
    console.error("Lib does not exist yet, skipping build-tries step.");
    process.exit(0); // eslint-disable-line no-process-exit
}
const parsePubSuffixList = require("../lib/trie/parsePubSuffixList");
const serializeTrie = require("../lib/trie/serializeTrie");

const PUBLIC_SUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const rootPath = path.resolve(__dirname, "..");
const triesPath = path.resolve(rootPath, "build", "tries");
const metaJsonFilename = path.resolve(triesPath, "meta.json");
const tries = [
    {
        listName: "icann",
        type: "complete",
        filename: "icann.complete.json",
    }, {
        listName: "icann",
        type: "light",
        filename: "icann.light.json",
    }, {
        listName: "private",
        type: "complete",
        filename: "private.complete.json",
    },
];

process.stderr.write(`Downloading public suffix list from ${PUBLIC_SUFFIX_URL}... `);

got(PUBLIC_SUFFIX_URL, {timeout: 60 * 1000})
    .then(res => {
        process.stderr.write("ok" + os.EOL);

        return res.body;
    })
    .then(parsePubSuffixList)
    .then(parsed =>
        tries
            .map(trie => {
                const parsedList = parsed[trie.listName];

                return {
                    path: path.resolve(triesPath, trie.filename),
                    content: JSON.stringify({
                        trie: serializeTrie(parsedList, trie.type),
                    }),
                };
            })
            .forEach(file => {
                process.stderr.write(`Writing ${file.path}... `);
                mkdirp.sync(path.dirname(file.path));
                fs.writeFileSync(file.path, file.content, "utf8");
                process.stderr.write("ok" + os.EOL);
            })
    )
    .then(() => {
        process.stderr.write("Running sanity check... ");

        childProcess.execFileSync(process.execPath, [require.resolve(".bin/jest")], {
            cwd: rootPath,
            encoding: "utf8",
        });

        process.stderr.write("ok" + os.EOL);

        fs.writeFileSync(
            metaJsonFilename,
            JSON.stringify({
                updatedAt: new Date().toISOString(),
            }),
            "utf8"
        );
    })
    .catch(err => {
        console.error("");
        console.error(`Could not update list of known top-level domains for parse-domain because of "${err.message}"`);

        const metaJson = JSON.parse(fs.readFileSync(metaJsonFilename, "utf8"));

        console.error("Using possibly outdated prebuilt list from " + new Date(metaJson.updatedAt).toDateString());

        // We can recover using the (possibly outdated) prebuilt list, hence exit code 0
        process.exit(0); // eslint-disable-line no-process-exit
    })
    .catch(() => {
        process.exit(1); // eslint-disable-line no-process-exit
    });
