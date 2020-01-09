import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/icann.json";

export const icannCompleteTrie = parseTrie(serializedTrie);
