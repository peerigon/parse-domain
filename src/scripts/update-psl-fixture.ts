import * as fs from "node:fs";
import * as path from "node:path";
import { fetchPsl } from "../psl/fetch-psl.js";

const pathToPslFixture = path.resolve(
  import.meta.dirname,
  "..",
  "tests",
  "fixtures",
  "public-suffix-list.txt",
);

const psl = await fetchPsl();

await fs.promises.writeFile(pathToPslFixture, psl);
