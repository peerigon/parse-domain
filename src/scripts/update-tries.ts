import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import { fetchBuildSerializeTries } from "../update-tries.js";
import { PUBLIC_SUFFIX_URL } from "../config.js";
import { Await } from "../type-util.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const writeTriesToFiles = async ({
  serializedIcannTrie,
  serializedPrivateTrie,
}: Await<ReturnType<typeof fetchBuildSerializeTries>>) => {
  const indexOfScriptArg = process.argv.lastIndexOf("--");
  const targetDirectories = process.argv.slice(indexOfScriptArg + 1);

  await Promise.all(
    targetDirectories.map(async (targetDirectory) => {
      const pathToIcannTrie = path.resolve(
        __dirname,
        targetDirectory,
        "icann.js",
      );
      const pathToPrivateTrie = path.resolve(
        __dirname,
        targetDirectory,
        "private.js",
      );
      const pathToTrieInfoFile = path.resolve(
        __dirname,
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

export const done = (async () => {
  console.warn(`Fetching public suffix list from ${PUBLIC_SUFFIX_URL}...`);

  await writeTriesToFiles(await fetchBuildSerializeTries());
})();
