import {resolve} from "path";
import {promises as fs} from "fs";
import {fetchPsl} from "../psl/fetch-psl";

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
