import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/tries/icann.complete.json";

export const icannCompleteTrie = parseTrie(serializedTrie.trie);
