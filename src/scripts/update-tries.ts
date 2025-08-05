import * as fs from "node:fs";
import * as path from "node:path";
import { PUBLIC_SUFFIX_URL } from "../config.js";
import type { Await } from "../type-util.js";
import { fetchBuildSerializeTries } from "../update-tries.js";

const writeTriesToFiles = async ({
  serializedIcannTrie,
  serializedPrivateTrie,
}: Await<ReturnType<typeof fetchBuildSerializeTries>>) => {
  const indexOfScriptArg = process.argv.lastIndexOf("--");
  const targetDirectories = process.argv.slice(indexOfScriptArg + 1);

  await Promise.all(
    targetDirectories.map(async (targetDirectory) => {
      const pathToIcannTrie = path.resolve(
        import.meta.dirname,
        targetDirectory,
        "icann.js",
      );
      const pathToPrivateTrie = path.resolve(
        import.meta.dirname,
        targetDirectory,
        "private.js",
      );
      const pathToTrieInfoFile = path.resolve(
        import.meta.dirname,
        targetDirectory,
        "info.json",
      );

      console.warn(`Writing ${pathToIcannTrie}...`);
      console.warn(`Writing ${pathToPrivateTrie}...`);
      console.warn(`Writing ${pathToTrieInfoFile}...`);

      await Promise.all([
        fs.promises.writeFile(
          pathToIcannTrie,
          `export default ${JSON.stringify(serializedIcannTrie)};`,
        ),
        fs.promises.writeFile(
          pathToPrivateTrie,
          `export default ${JSON.stringify(serializedPrivateTrie)};`,
        ),
        fs.promises.writeFile(
          pathToTrieInfoFile,
          JSON.stringify({
            updatedAt: new Date(),
          }),
        ),
      ]);
    }),
  );
};

console.warn(`Fetching public suffix list from ${PUBLIC_SUFFIX_URL}...`);

await writeTriesToFiles(await fetchBuildSerializeTries());
