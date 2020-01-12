import {toASCII} from "punycode";
import {
	PUBLIC_SUFFIX_MARKER_ICANN_START,
	PUBLIC_SUFFIX_MARKER_ICANN_END,
	PUBLIC_SUFFIX_MARKER_PRIVATE_START,
	PUBLIC_SUFFIX_MARKER_PRIVATE_END,
} from "../const";

type ParsedPublicSuffixList = {
	icann: Array<string>;
	private: Array<string>;
};

const matchNewLine = /\r?\n/;
const matchComment = /^\s*\/\//;
const matchWhitespace = /^\s*$/;

const extractByMarkers = (listContent: string, startMarker: string, endMarker: string): string => {
	const start = listContent.indexOf(startMarker);
	const end = listContent.indexOf(endMarker);

	if (start === -1) {
		throw new Error(`Missing start marker ${startMarker} in public suffix list`);
	}
	if (end === -1) {
		throw new Error(`Missing end marker ${endMarker} in public suffix list`);
	}

	return listContent.slice(start, end);
};

const containsRule = (line: string): boolean =>
	matchComment.test(line) === false && matchWhitespace.test(line) === false;

const normalizeRule = (rule: string) =>
// TODO: Add link to issue in comment
	/*
	Users of parse-domain should only pass parsed hostnames (e.g. via new URL("...").hostname)
	to parseDomain(). This frees us from the burden of URL parsing.
	The problem is that new URL("...").hostname will also translate all non-ASCII characters
	into punycode (e.g. 大分.jp becomes xn--kbrq7o.jp). This means for us that our serialized
	trie should only contain punycode hostnames.

	The downside of this is that punycode hostnames are bigger in terms of file size,
	but that's still better than including a punycode library into the runtime code of parse-domain.
	Gzip is also very effective in removing duplicate characters.
	*/
	toASCII(rule).toLowerCase();

export const parsePublicSuffixList = (listContent: string): ParsedPublicSuffixList => {
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
