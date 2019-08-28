import {resolve} from "path";

export const pathToBuildDir = resolve(__dirname, "..", "build");
export const pathToTriesDir = resolve(pathToBuildDir, "tries");
export const pathToIcannCompleteTrie = resolve(pathToTriesDir, "icann.complete.json");
export const pathToIcannLightTrie = resolve(pathToTriesDir, "icann.light.json");
export const pathToPrivateTrie = resolve(pathToTriesDir, "private.json");
export const pathToTrieMetaFile = resolve(pathToTriesDir, "meta.json");
export const pathToPslFile = resolve(pathToBuildDir, "public-suffix-list.txt");
