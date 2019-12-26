import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/tries/private.complete.json";

export const privateTrie = parseTrie(serializedTrie.trie);
