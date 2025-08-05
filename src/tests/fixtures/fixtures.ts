import * as fs from "node:fs";
import * as path from "node:path";
import { fetchPsl } from "../../psl/fetch-psl.js";

const pathToPslFixture = path.resolve(
  import.meta.dirname,
  "public-suffix-list.txt",
);

export const updatePslFixture = async () => {
  const psl = await fetchPsl();

  await fs.promises.writeFile(pathToPslFixture, psl);
};

export const readPslFixture = async () => {
  return fs.promises.readFile(pathToPslFixture, "utf8");
};
