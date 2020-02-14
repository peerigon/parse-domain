import {promises as fs} from "fs";
import {pathToPslFixture} from "../config";
import {fetchPsl} from "../psl/fetch-psl";

fetchPsl()
	.then(async (psl) => {
		await fs.writeFile(pathToPslFixture, psl);
	})
	.catch((error) => {
		setTimeout(() => {
			throw error;
		});
	});
