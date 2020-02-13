import {promises as fs} from "fs";
import {resolve} from "path";
import {fetchPsl} from "./psl/fetch-psl";
import {buildTries} from "./psl/build-tries";
import {serializeTrie} from "./trie/serialize-trie";

export const update = async ({buildPath}: {buildPath: string}) => {
	const psl = await fetchPsl();
	const {icannTrie, privateTrie} = buildTries(psl);
	const serializedIcannTrie = serializeTrie(icannTrie);
	const serializedPrivateTrie = serializeTrie(privateTrie);
	const info = {
		updatedAt: new Date(),
	};

	await Promise.all([
		fs.writeFile(
			resolve(buildPath, "icann.json"),
			JSON.stringify(serializedIcannTrie),
		),
		fs.writeFile(
			resolve(buildPath, "private.json"),
			JSON.stringify(serializedPrivateTrie),
		),
		fs.writeFile(buildPath, "info.json", JSON.stringify(info)),
	]);

	return {
		psl,
		info,
		serializedIcannTrie,
		serializedPrivateTrie,
	};
};
