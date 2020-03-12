import {resolve, basename} from "path";
import {promises as fs} from "fs";
import {updateTries} from "../update-tries";
import {PUBLIC_SUFFIX_URL} from "../config";

const basenameOfThisScript = basename(__filename);
const indexOfScriptArg = process.argv.findIndex((arg) =>
	arg.endsWith(basenameOfThisScript),
);
const targetDirectories = process.argv.slice(indexOfScriptArg + 1);

console.log(`Fetching public suffix list from ${PUBLIC_SUFFIX_URL}...`);
updateTries()
	.then(async ({serializedIcannTrie, serializedPrivateTrie}) => {
		await Promise.all(
			targetDirectories.map(async (targetDirectory) => {
				const pathToIcannTrie = resolve(targetDirectory, "icann.json");
				const pathToPrivateTrie = resolve(targetDirectory, "private.json");
				const pathToTrieInfoFile = resolve(targetDirectory, "info.json");

				console.log(`Writing ${pathToIcannTrie}...`);
				console.log(`Writing ${pathToPrivateTrie}...`);

				await Promise.all([
					fs.writeFile(pathToIcannTrie, JSON.stringify(serializedIcannTrie)),
					fs.writeFile(
						pathToPrivateTrie,
						JSON.stringify(serializedPrivateTrie),
					),
					fs.writeFile(
						pathToTrieInfoFile,
						JSON.stringify({
							updatedAt: new Date(),
						}),
					),
				]);
			}),
		);
	})
	.catch((error) => {
		setTimeout(() => {
			throw error;
		});
	});
