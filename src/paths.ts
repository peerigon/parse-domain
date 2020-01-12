import {resolve} from "path";

export const pathToBuildDir = resolve(__dirname, "..", "build");
export const pathToIcannTrie = resolve(pathToBuildDir, "icann.json");
export const pathToPrivateTrie = resolve(pathToBuildDir, "private.json");
export const pathToTrieInfoFile = resolve(pathToBuildDir, "info.json");
export const pathToPslFile = resolve(pathToBuildDir, "public-suffix-list.txt");
