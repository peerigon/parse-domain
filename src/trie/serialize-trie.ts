import * as characters from "./characters";
import {Domains} from "../domains";

export enum TrieTypes {
	Complete,
	Light,
}

const LINE_FILTERS = {
	[TrieTypes.Complete]: () => true,
	[TrieTypes.Light]: (line: Domains) => line.length > 1,
} as const;

const compareLinesAt = (lineA: Domains, lineB: Domains, i: number): number => {
	const endOfLineA = i === lineA.length;
	const endOfLineB = i === lineB.length;

	if (endOfLineA || endOfLineB) {
		return lineA.length - lineB.length;
	}

	const localeCompareResult = lineA[i].localeCompare(lineB[i]);

	if (localeCompareResult === 0) {
		return localeCompareResult;
	}

	return compareLinesAt(lineA, lineB, i + 1);
};

const findIndexOfDifference = (lineA: Domains, lineB: Domains): number => {
	const maxLength = Math.max(lineA.length, lineB.length);

	for (let i = 0; i < maxLength; i++) {
		if (lineA[i] !== lineB[i]) {
			return i;
		}
	}

	return -1;
};

const lineToString = (line: Domains, i: number, lines: Array<Domains>): string => {
	let indexOfDifference = 0;
	let separatorFromPrev = "";

	if (i > 0) {
		const prevLine = lines[i - 1];

		indexOfDifference = findIndexOfDifference(line, prevLine);

		if (indexOfDifference === -1) {
			// Identical lines
			return "";
		}
		if (indexOfDifference === 0) {
			// line and prevLine are completely different
			separatorFromPrev = characters.RESET;
		} else if (indexOfDifference === prevLine.length - 1) {
			// only the last part of line and prevLine are different
			separatorFromPrev = characters.SAME;
		} else if (indexOfDifference > prevLine.length - 1) {
			// we don't need to go up the hierarchy first because prevLine is part of line
			// so let's just start with an initial down separator
			separatorFromPrev = characters.DOWN;
		} else {
			// line and prevLine are different, but share a common root at indexOfDifference - 1
			// we now need to go up the hierarchy to the common root
			const levelsUp = prevLine.length - indexOfDifference - 1;

			/* istanbul ignore if */
			if (levelsUp < 1) {
				// This is just a sanity check to ensure that serializeTrie() fails early if
				// public suffix contains some unexpected rules.
				// separatorFromPrev should never be an empty string if i > 0
				// See https://github.com/peerigon/parse-domain/pull/65
				throw new Error(
					"Cannot serialize trie: The public suffix list contains unexpected rules.",
				);
			}

			separatorFromPrev = new Array(levelsUp).fill(characters.UP)
				.join("");
		}
	}

	return separatorFromPrev + line.slice(indexOfDifference).join(characters.DOWN);
};

export const serializeTrie = (
	lines: Array<string>,
	type: TrieTypes = TrieTypes.Complete,
): string => {
	/**
	 * lines looks like:
	 * [
	 *  "com",
	 *  "co.uk",
	 *  "gov.uk",
	 *  "静岡.jp",
	 *  "岐阜.jp",
	 *  "موقع"
	 * ]
	 *
	 * The resulting tree looks like this:
	 * com      uk          jp         موقع
	 *         /  \        /  \
	 *       co   gov   静岡   岐阜
	 *
	 * And the textual representation of the trie looks like (using SEPARATORS):
	 * com|uk>co,gov|jp>静岡,岐阜|موقع
	 *
	 * With type "light", all domains with no subdomain are excluded from the serialized trie:
	 * uk>co,gov|jp>静岡,岐阜
	 */

	return Array.from(lines.values(), (line) => line.split("."))
		.filter(LINE_FILTERS[type])
		.map((line) => line.reverse())
		.sort((lineA, lineB) => compareLinesAt(lineA, lineB, 0))
		.map(lineToString)
		.join("");
};
