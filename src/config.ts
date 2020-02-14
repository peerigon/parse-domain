import {resolve} from "path";

export const PUBLIC_SUFFIX_URL =
	"https://publicsuffix.org/list/public_suffix_list.dat";
export const PUBLIC_SUFFIX_MARKER_ICANN_START = "// ===BEGIN ICANN DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_ICANN_END = "// ===END ICANN DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_PRIVATE_START =
	"// ===BEGIN PRIVATE DOMAINS===";
export const PUBLIC_SUFFIX_MARKER_PRIVATE_END = "// ===END PRIVATE DOMAINS===";
export const FETCH_PSL_EXPECTED_MIN_LENGTH = 214528;

const pathToBuildTriesDir = resolve(__dirname, "..", "serialized-tries");

export const pathToIcannTrie = resolve(pathToBuildTriesDir, "icann.json");
export const pathToPrivateTrie = resolve(pathToBuildTriesDir, "private.json");
export const pathToTrieInfoFile = resolve(pathToBuildTriesDir, "info.json");

const pathToFixturesDir = resolve(__dirname, "tests", "fixtures");

export const pathToPslFixture = resolve(
	pathToFixturesDir,
	"public-suffix-list.txt",
);
