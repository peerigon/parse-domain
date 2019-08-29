import {writeFileSync, readFileSync} from "fs";
import {
	pathToPslFile,
	pathToIcannCompleteTrie,
	pathToPrivateTrie,
	pathToTrieMetaFile,
} from "../paths";
import {parsePublicSuffixList} from "../psl/parse-psl";
import {serializeTrie} from "../trie/serialize-trie";
import { createTrieFromList } from "../trie/create-trie";

const buildTries = async (): Promise<void> => {
	const pslContent = readFileSync(pathToPslFile, "utf8");
	const parsedPsl = parsePublicSuffixList(pslContent);
	const icannTrie = createTrieFromList(parsedPsl.icann);
	const privateTrie = createTrieFromList(parsedPsl.private);

	writeFileSync(
		pathToIcannCompleteTrie,
		JSON.stringify(serializeTrie(icannTrie)),
	);
	writeFileSync(
		pathToPrivateTrie,
		JSON.stringify(serializeTrie(privateTrie)),
	);

	writeFileSync(
		pathToTrieMetaFile,
		JSON.stringify({
			updatedAt: new Date().toISOString(),
		}),
	);
};

buildTries().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
