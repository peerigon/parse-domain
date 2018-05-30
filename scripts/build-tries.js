"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const got = require("got");
const copySync = require("fs-copy-file-sync");
const mkdirp = require("mkdirp");
const parsePubSuffixList = require("../lib/tries/parsePubSuffixList");
const serializeTrie = require("../lib/tries/serializeTrie");

const PUBLIC_SUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const rootPath = path.resolve(__dirname, "..");
const triesPrePath = path.resolve(rootPath, "build", "tries", "pre");
const triesPath = path.resolve(rootPath, "build", "tries", "current");
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

process.stderr.write(`Downloading public suffix list from ${ PUBLIC_SUFFIX_URL }... `);

got(PUBLIC_SUFFIX_URL)
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
                        updatedAt: new Date().toISOString(),
                        trie: serializeTrie(parsedList, trie.type),
                    }),
                };
            })
            .forEach(file => {
                process.stderr.write(`Writing ${ file.path }... `);
                mkdirp.sync(path.dirname(file.path));
                fs.writeFileSync(file.path, file.content, "utf8");
                process.stderr.write("ok" + os.EOL);
            })
    )
    .then(() => {
        process.stderr.write("Running sanity check... ");
        childProcess.spawnSync("mocha -R dot", {
            cwd: rootPath,
            encoding: "utf8",
            stdio: "ignore",
        });
        process.stderr.write("ok" + os.EOL);
    })
    .catch(err => {
        console.error("");
        console.error("Could not update list of known top-level domains for parse-domain because of " + err.message);

        tries.forEach(list => {
            const src = path.resolve(triesPrePath, list.filename);
            const dest = path.resolve(triesPath, list.filename);

            mkdirp.sync(path.dirname(dest));
            copySync(src, dest);
        });

        const prebuiltList = JSON.parse(fs.readFileSync(path.resolve(triesPrePath, tries[0].filename)));

        console.error("Using possibly outdated prebuilt list from " + new Date(prebuiltList.updatedAt).toDateString());

        // We can recover using the (possibly outdated) prebuilt list, hence exit code 0
        process.exit(0); // eslint-disable-line no-process-exit
    })
    .catch(() => {
        process.exit(1); // eslint-disable-line no-process-exit
    });
