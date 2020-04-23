import {toASCII} from "punycode";
import {
	PUBLIC_SUFFIX_MARKER_ICANN_START,
	PUBLIC_SUFFIX_MARKER_ICANN_END,
	PUBLIC_SUFFIX_MARKER_PRIVATE_START,
	PUBLIC_SUFFIX_MARKER_PRIVATE_END,
} from "../config";
import {createTrieFromList} from "../trie/create-trie";

const matchNewLine = /\r?\n/u;
const matchComment = /^\s*\/\//u;
const matchWhitespace = /^\s*$/u;

const extractByMarkers = (
	listContent: string,
	startMarker: string,
	endMarker: string,
) => {
	const start = listContent.indexOf(startMarker);
	const end = listContent.indexOf(endMarker);

	if (start === -1) {
		throw new Error(
			`Missing start marker ${startMarker} in public suffix list`,
		);
	}
	if (end === -1) {
		throw new Error(`Missing end marker ${endMarker} in public suffix list`);
	}

	return listContent.slice(start, end);
};

const containsRule = (line: string) =>
	matchComment.test(line) === false && matchWhitespace.test(line) === false;

const normalizeRule = (rule: string) =>
	/*
	Users of parse-domain should only pass parsed hostnames (e.g. via new URL("...").hostname)
	to parseDomain(). This frees us from the burden of URL parsing.
	See also https://github.com/peerigon/parse-domain/issues/14

	The problem is that new URL("...").hostname will also translate all non-ASCII characters
	into punycode (e.g. 大分.jp becomes xn--kbrq7o.jp). This means for us that our serialized
	trie needs to use punyencoded hostnames.

	The downside of this is that punycode hostnames are bigger in terms of file size.
	However, that's still better than including a punycode library into the runtime code of parse-domain.
	Gzip is also very effective in removing duplicate characters.
	*/
	toASCII(rule).toLowerCase();

const parsePsl = (listContent: string) => {
	return {
		icann: extractByMarkers(
			listContent,
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			PUBLIC_SUFFIX_MARKER_ICANN_END,
		)
			.split(matchNewLine)
			.filter(containsRule)
			.map(normalizeRule),
		private: extractByMarkers(
			listContent,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		)
			.split(matchNewLine)
			.filter(containsRule)
			.map(normalizeRule),
	};
};

export const buildTries = (psl: string) => {
	const parsedPsl = parsePsl(psl);
	const icannTrie = createTrieFromList(parsedPsl.icann);
	const privateTrie = createTrieFromList(parsedPsl.private);

	return {
		icannTrie,
		privateTrie,
	};
};
