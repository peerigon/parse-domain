import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import { fetchPsl } from "../psl/fetch-psl.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const done = (async () => {
  const pathToPslFixture = path.resolve(
    __dirname,
    "..",
    "tests",
    "fixtures",
    "public-suffix-list.txt"
  );

  const psl = await fetchPsl();

  await fs.promises.writeFile(pathToPslFixture, psl);
})();
