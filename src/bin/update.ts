import {promises as fs} from "fs";
import {paths} from "../config";
import {fetchPsl} from "../psl/fetch-psl";
import {buildTries} from "../psl/build-tries";
import {serializeTrie} from "../trie/serialize-trie";

export const update = async () => {
	const psl = await fetchPsl();
	const {icannTrie, privateTrie} = buildTries(psl);

	await Promise.all([
		fs.writeFile(
			paths.pathToIcannTrie,
			JSON.stringify(serializeTrie(icannTrie)),
		),
		fs.writeFile(
			paths.pathToPrivateTrie,
			JSON.stringify(serializeTrie(privateTrie)),
		),
		fs.writeFile(
			paths.pathToTrieInfoFile,
			JSON.stringify({
				updatedAt: new Date(),
			}),
		),
	]);
};
