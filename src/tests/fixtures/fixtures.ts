import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import { fetchPsl } from "../../psl/fetch-psl.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pathToPslFixture = path.resolve(__dirname, "public-suffix-list.txt");

export const updatePslFixture = async () => {
  const psl = await fetchPsl();

  await fs.promises.writeFile(pathToPslFixture, psl);
};

export const readPslFixture = async () => {
  return fs.promises.readFile(pathToPslFixture, "utf8");
};
