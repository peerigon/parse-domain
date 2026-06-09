#!/usr/bin/env node
import * as fs from "node:fs";
import { EOL } from "node:os";
import * as path from "node:path";
import { runSmokeTest } from "../smoke-test.js";
import { fetchBuildSerializeTries } from "../update-tries.js";

const serializedTriesDir = path.resolve(
  import.meta.dirname,
  "../../serialized-tries",
);

const { serializedIcannTrie, serializedPrivateTrie } =
  await fetchBuildSerializeTries();

await Promise.all([
  fs.promises.writeFile(
    path.join(serializedTriesDir, "icann.js"),
    `export default ${JSON.stringify(serializedIcannTrie)};`,
  ),
  fs.promises.writeFile(
    path.join(serializedTriesDir, "private.js"),
    `export default ${JSON.stringify(serializedPrivateTrie)};`,
  ),
  fs.promises.writeFile(
    path.join(serializedTriesDir, "info.json"),
    JSON.stringify({ updatedAt: new Date() }),
  ),
]);

process.stderr.write("Running smoke test... ");
runSmokeTest();
process.stdout.write("ok" + EOL);
