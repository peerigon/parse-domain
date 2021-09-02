import fileSystem from "fs";
import { resolve } from "path";
import { promisify } from "util";
import { fetchPsl } from "../../psl/fetch-psl";

// TODO: Replace this with fs promises once we removed Node 8
const fs = {
  readFile: promisify(fileSystem.readFile),
  writeFile: promisify(fileSystem.writeFile),
};

const pathToPslFixture = resolve(__dirname, "public-suffix-list.txt");

export const updatePslFixture = async () => {
  const psl = await fetchPsl();

  await fs.writeFile(pathToPslFixture, psl);
};

export const readPslFixture = async () => {
  return fs.readFile(pathToPslFixture, "utf8");
};
