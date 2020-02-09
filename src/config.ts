import {resolve} from "path";

export const PUBLIC_SUFFIX_URL =
	"https://publicsuffix.org/list/public_suffix_list.dat";
export const PUBLIC_SUFFIX_FETCH_TIMEOUT = 60000; // in milliseconds
export const PUBLIC_SUFFIX_MARKER_ICANN_START = "// ===BEGIN ICANN DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_ICANN_END = "// ===END ICANN DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_PRIVATE_START =
	"// ===BEGIN PRIVATE DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_PRIVATE_END = "// ===END PRIVATE DOMAINS===";
export const FETCH_PSL_EXPECTED_MIN_LENGTH = 214528;

const pathToBuildDir = resolve(__dirname, "..", "build");
const pathToIcannTrie = resolve(pathToBuildDir, "icann.json");
const pathToPrivateTrie = resolve(pathToBuildDir, "private.json");
const pathToTrieInfoFile = resolve(pathToBuildDir, "info.json");
const pathToPslFile = resolve(pathToBuildDir, "public-suffix-list.txt");

export const paths = {
	pathToBuildDir,
	pathToIcannTrie,
	pathToPrivateTrie,
	pathToTrieInfoFile,
	pathToPslFile,
};
