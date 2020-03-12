import {promises as fs} from "fs";
import {resolve} from "path";
import {fetchPsl} from "./psl/fetch-psl";
import {buildTries} from "./psl/build-tries";
import {serializeTrie} from "./trie/serialize-trie";
import {Await} from "./type-util";

export const updateTries = async () => {
	const psl = await fetchPsl();
	const {icannTrie, privateTrie} = buildTries(psl);
	const serializedIcannTrie = serializeTrie(icannTrie);
	const serializedPrivateTrie = serializeTrie(privateTrie);

	return {
		serializedIcannTrie,
		serializedPrivateTrie,
	};
};

export const writeTriesToFiles = async ({
	serializedIcannTrie,
	serializedPrivateTrie,
	targetDirectories,
}: Await<ReturnType<typeof updateTries>> & {
	targetDirectories: Array<string>;
}) => {
	await Promise.all(
		targetDirectories.map(async (targetDirectory) => {
			const pathToIcannTrie = resolve(targetDirectory, "icann.json");
			const pathToPrivateTrie = resolve(targetDirectory, "private.json");
			const pathToTrieInfoFile = resolve(targetDirectory, "info.json");

			console.log(`Writing ${pathToIcannTrie}...`);
			console.log(`Writing ${pathToPrivateTrie}...`);

			await Promise.all([
				fs.writeFile(pathToIcannTrie, JSON.stringify(serializedIcannTrie)),
				fs.writeFile(pathToPrivateTrie, JSON.stringify(serializedPrivateTrie)),
				fs.writeFile(
					pathToTrieInfoFile,
					JSON.stringify({
						updatedAt: new Date(),
					}),
				),
			]);
		}),
	);
};
