import {resolve} from "path";
import {promises as fs} from "fs";
import {fetchPsl} from "../psl/fetch-psl";

const pathToPslFixture = resolve(
	__dirname,
	"tests",
	"fixtures",
	"public-suffix-list.txt",
);

fetchPsl()
	.then(async (psl) => {
		await fs.writeFile(pathToPslFixture, psl);
	})
	.catch((error) => {
		setTimeout(() => {
			throw error;
		});
	});
