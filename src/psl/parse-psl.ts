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

export const parsePublicSuffixList = (listContent: string): ParsedPublicSuffixList => {
	return {
		icann: extractByMarkers(
			listContent,
			PUBLIC_SUFFIX_MARKER_ICANN_START,
			PUBLIC_SUFFIX_MARKER_ICANN_END,
		)
			.split(matchNewLine)
			.filter(containsRule)
			// Punycode encoded rules are longer, but it's still better than including the punycode library into the runtime code of parse-domain.
			// Gzip is also very effective in removing the duplicate characters.
			// Please also note:
			// new URL().hostname is punycode encoded which means that we must compare punycode encoded hostnames against our rules at runtime.
			.map(line => toASCII(line)),
		private: extractByMarkers(
			listContent,
			PUBLIC_SUFFIX_MARKER_PRIVATE_START,
			PUBLIC_SUFFIX_MARKER_PRIVATE_END,
		)
			.split(matchNewLine)
			.filter(containsRule)
			.map(line => toASCII(line)),
	};
};
