#!/usr/bin/env node
import { EOL } from "node:os";

process.argv.push("--", "../../serialized-tries");

await import("../dist/scripts/update-tries.js");

process.stderr.write("Running smoke test... ");

const { runSmokeTest } = await import("../dist/smoke-test.js");

runSmokeTest();

process.stdout.write("ok" + EOL);
