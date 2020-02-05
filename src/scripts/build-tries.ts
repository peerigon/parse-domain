import {promises as fs} from "fs";
import {pathToPslFile, pathToIcannTrie, pathToPrivateTrie} from "../paths";
import {parsePublicSuffixList} from "../psl/parse-psl";
import {serializeTrie} from "../trie/serialize-trie";
import {createTrieFromList} from "../trie/create-trie";

const buildTries = async (): Promise<void> => {
	const pslContent = await fs.readFile(pathToPslFile, "utf8");
	const parsedPsl = parsePublicSuffixList(pslContent);
	const icannTrie = createTrieFromList(parsedPsl.icann);
	const privateTrie = createTrieFromList(parsedPsl.private);

	await Promise.all([
		fs.writeFile(pathToIcannTrie, JSON.stringify(serializeTrie(icannTrie))),
		fs.writeFile(pathToPrivateTrie, JSON.stringify(serializeTrie(privateTrie))),
	]);
};

buildTries().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
