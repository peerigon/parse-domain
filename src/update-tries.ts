import { fetchPsl } from "./psl/fetch-psl.js";
import { buildTries } from "./psl/build-tries.js";
import { serializeTrie } from "./trie/serialize-trie.js";

export const fetchBuildSerializeTries = async () => {
  const psl = await fetchPsl();
  const { icannTrie, privateTrie } = buildTries(psl);
  const serializedIcannTrie = serializeTrie(icannTrie);
  const serializedPrivateTrie = serializeTrie(privateTrie);

  return {
    serializedIcannTrie,
    serializedPrivateTrie,
  };
};
