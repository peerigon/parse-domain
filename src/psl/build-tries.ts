import {
  PUBLIC_SUFFIX_MARKER_ICANN_START,
  PUBLIC_SUFFIX_MARKER_ICANN_END,
  PUBLIC_SUFFIX_MARKER_PRIVATE_START,
  PUBLIC_SUFFIX_MARKER_PRIVATE_END,
} from "../config";
import { toASCII } from "../punycode";
import { createTrieFromList } from "../trie/create-trie";

const matchNewLine = /\r?\n/u;
const matchComment = /^\s*\/\//u;
const matchWhitespace = /^\s*$/u;

const extractByMarkers = (
  listContent: string,
  startMarker: string,
  endMarker: string
) => {
  const start = listContent.indexOf(startMarker);
  const end = listContent.indexOf(endMarker);

  if (start === -1) {
    throw new Error(
      `Missing start marker ${startMarker} in public suffix list`
    );
  }
  if (end === -1) {
    throw new Error(`Missing end marker ${endMarker} in public suffix list`);
  }

  return listContent.slice(start, end);
};

const containsRule = (line: string) =>
  matchComment.test(line) === false && matchWhitespace.test(line) === false;

const parsePsl = (listContent: string) => {
  return {
    icann: extractByMarkers(
      listContent,
      PUBLIC_SUFFIX_MARKER_ICANN_START,
      PUBLIC_SUFFIX_MARKER_ICANN_END
    )
      .split(matchNewLine)
      .filter(containsRule)
      .map(toASCII),
    private: extractByMarkers(
      listContent,
      PUBLIC_SUFFIX_MARKER_PRIVATE_START,
      PUBLIC_SUFFIX_MARKER_PRIVATE_END
    )
      .split(matchNewLine)
      .filter(containsRule)
      .map(toASCII),
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
