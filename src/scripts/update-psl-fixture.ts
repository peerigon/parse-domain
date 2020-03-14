import {resolve} from "path";
import fileSystem from "fs";
import {promisify} from "util";
import {fetchPsl} from "../psl/fetch-psl";

// TODO: Replace this with fs promises once we removed Node 8
const fs = {
	writeFile: promisify(fileSystem.writeFile),
};

export const done = (async () => {
	const pathToPslFixture = resolve(
		__dirname,
		"tests",
		"fixtures",
		"public-suffix-list.txt",
	);

	const psl = await fetchPsl();

	await fs.writeFile(pathToPslFixture, psl);
})();
