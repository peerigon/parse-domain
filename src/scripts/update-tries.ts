import {promises as fs} from "fs";
import {updateTries} from "../update-tries";
import {
	pathToIcannTrie,
	pathToPrivateTrie,
	pathToTrieInfoFile,
} from "../config";

updateTries()
	.then(async ({serializedIcannTrie, serializedPrivateTrie}) => {
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
	})
	.catch((error) => {
		setTimeout(() => {
			throw error;
		});
	});
