import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/private.json";

export const privateTrie = parseTrie(serializedTrie);
