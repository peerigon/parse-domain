import {fetchPsl} from "./psl/fetch-psl";
import {buildTries} from "./psl/build-tries";
import {serializeTrie} from "./trie/serialize-trie";

export const fetchBuildSerializeTries = async () => {
	const psl = await fetchPsl();
	const {icannTrie, privateTrie} = buildTries(psl);
	const serializedIcannTrie = serializeTrie(icannTrie);
	const serializedPrivateTrie = serializeTrie(privateTrie);

	return {
		serializedIcannTrie,
		serializedPrivateTrie,
	};
};
