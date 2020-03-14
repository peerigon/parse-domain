#!/usr/bin/env node

"use strict";

const {EOL} = require("os");
const {deepStrictEqual} = require("assert");

const runSmokeTest = () => {
	const {parseDomain} = require("../build-cjs/src/main.js");

	deepStrictEqual(parseDomain("www.example.com"), {
		hostname: "www.example.com",
		type: "LISTED",
		subDomains: ["www"],
		domain: "example",
		topLevelDomains: ["com"],
		icann: {
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["com"],
		},
	});
	deepStrictEqual(parseDomain("www.example.co.uk"), {
		hostname: "www.example.co.uk",
		type: "LISTED",
		subDomains: ["www"],
		domain: "example",
		topLevelDomains: ["co", "uk"],
		icann: {
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["co", "uk"],
		},
	});
	deepStrictEqual(parseDomain("www.example.cloudfront.net"), {
		hostname: "www.example.cloudfront.net",
		type: "LISTED",
		subDomains: ["www"],
		domain: "example",
		topLevelDomains: ["cloudfront", "net"],
		icann: {
			subDomains: ["www", "example"],
			domain: "cloudfront",
			topLevelDomains: ["net"],
		},
	});
};

(async () => {
	process.argv.push(
		"--",
		"../../serialized-tries",
		"../../../build-esm/serialized-tries",
	);

	await require("../build-cjs/src/scripts/update-tries.js").done;

	process.stderr.write("Running smoke test... ");

	runSmokeTest();

	process.stdout.write("ok" + EOL);
})().catch((error) => {
	console.error(`parse-domain update failed: ${error}`);
	// eslint-disable-next-line no-process-exit
	process.exit(1);
});
