#!/usr/bin/env node

import { EOL } from "os";

(async () => {
  process.argv.push("--", "../../serialized-tries");

  const updateTries = await import("../build/scripts/update-tries.js");

  await updateTries.done;

  process.stderr.write("Running smoke test... ");

  const smokeTest = await import("../build/smoke-test.js");

  smokeTest.runSmokeTest();

  process.stdout.write("ok" + EOL);
})().catch((error) => {
  console.error(`parse-domain update failed: ${error}`);
  process.exit(1);
});
