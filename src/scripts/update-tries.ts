import {resolve, basename} from "path";
import {promises as fs} from "fs";
import {fetchBuildSerializeTries} from "../update-tries";
import {PUBLIC_SUFFIX_URL} from "../config";
import {Await} from "../type-util";

const writeTriesToFiles = async ({
	serializedIcannTrie,
	serializedPrivateTrie,
}: Await<ReturnType<typeof fetchBuildSerializeTries>>) => {
	const indexOfScriptArg = process.argv.lastIndexOf("--");
	const targetDirectories = process.argv.slice(indexOfScriptArg + 1);

	await Promise.all(
		targetDirectories.map(async (targetDirectory) => {
			const pathToIcannTrie = resolve(__dirname, targetDirectory, "icann.json");
			const pathToPrivateTrie = resolve(
				__dirname,
				targetDirectory,
				"private.json",
			);
			const pathToTrieInfoFile = resolve(
				__dirname,
				targetDirectory,
				"info.json",
			);

			console.log(`Writing ${pathToIcannTrie}...`);
			console.log(`Writing ${pathToPrivateTrie}...`);
			console.log(`Writing ${pathToTrieInfoFile}...`);

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

export const done = (async () => {
	console.log(`Fetching public suffix list from ${PUBLIC_SUFFIX_URL}...`);

	await writeTriesToFiles(await fetchBuildSerializeTries());
})();
