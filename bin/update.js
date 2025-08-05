#!/usr/bin/env node
import { EOL } from "node:os";

process.argv.push("--", "../../serialized-tries");

const updateTries = await import("../build/scripts/update-tries.js");

await updateTries.done;

process.stderr.write("Running smoke test... ");

const smokeTest = await import("../build/smoke-test.js");

smokeTest.runSmokeTest();

process.stdout.write("ok" + EOL);
