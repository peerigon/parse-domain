import {writeFileSync, readFileSync} from "fs";
import {
	pathToPslFile,
	pathToIcannCompleteTrie,
	pathToIcannLightTrie,
	pathToPrivateTrie,
	pathToTrieMetaFile,
} from "../paths";
import {parsePublicSuffixList} from "../psl/parse-psl";
import {serializeTrie, TrieTypes} from "../trie/serialize-trie";

const buildTries = async (): Promise<void> => {
	const pslContent = readFileSync(pathToPslFile, "utf8");
	const parsedPsl = parsePublicSuffixList(pslContent);

	writeFileSync(
		pathToIcannCompleteTrie,
		JSON.stringify(serializeTrie(parsedPsl.icann, TrieTypes.Complete)),
	);
	writeFileSync(
		pathToIcannLightTrie,
		JSON.stringify(serializeTrie(parsedPsl.icann, TrieTypes.Light)),
	);
	writeFileSync(
		pathToPrivateTrie,
		JSON.stringify(serializeTrie(parsedPsl.private, TrieTypes.Complete)),
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
