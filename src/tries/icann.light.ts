import {parseTrie} from "../trie/parse-trie";
import serializedTrie from "../../build/tries/icann.light.json";

export const icannLightTrie = parseTrie(serializedTrie);
