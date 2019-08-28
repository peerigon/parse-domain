import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/tries/private.json";

export const privateTrie = parseTrie(serializedTrie);
