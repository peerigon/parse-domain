#!/usr/bin/env node

"use strict";

const {EOL} = require("os");

(async () => {
	process.argv.push(
		"--",
		"../../serialized-tries",
		"../../../build-esm/serialized-tries",
	);

	await require("../build-cjs/src/scripts/update-tries.js").done;

	process.stderr.write("Running smoke test... ");

	require("../build-cjs/src/smoke-test.js").runSmokeTest();

	process.stdout.write("ok" + EOL);
})().catch((error) => {
	console.error(`parse-domain update failed: ${error}`);
	// eslint-disable-next-line no-process-exit
	process.exit(1);
});
