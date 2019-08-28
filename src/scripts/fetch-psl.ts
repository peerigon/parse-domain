import {resolve} from "path";
import {writeFileSync} from "fs";
import {ok} from "assert";
import {fetchPublicSuffixList} from "../psl/fetch-psl";
import {pathToPslFile} from "../paths";
import {FETCH_PSL_EXPECTED_MIN_LENGTH} from "../const";

const fetchPsl = async (): Promise<void> => {
	const pslContent = await fetchPublicSuffixList();
	const pslPath = resolve(pathToPslFile);

	// Sanity check
	ok(pslContent.length >= FETCH_PSL_EXPECTED_MIN_LENGTH);

	writeFileSync(pslPath, pslContent);
};

fetchPsl().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
