import {resolve} from "path";
import {promises as fs} from "fs";
import {ok} from "assert";
import {fetchPublicSuffixList} from "../psl/fetch-psl";
import {pathToPslFile, pathToTrieInfoFile} from "../paths";
import {FETCH_PSL_EXPECTED_MIN_LENGTH} from "../const";

const fetchPsl = async () => {
	const pslContent = await fetchPublicSuffixList();
	const pslPath = resolve(pathToPslFile);

	// Sanity check
	ok(pslContent.length >= FETCH_PSL_EXPECTED_MIN_LENGTH);

	await Promise.all([
		fs.writeFile(pslPath, pslContent),
		fs.writeFile(
			pathToTrieInfoFile,
			JSON.stringify({
				updatedAt: new Date(),
			}),
		),
	]);
};

fetchPsl().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
