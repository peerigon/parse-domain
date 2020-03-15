import {icannTrie, privateTrie} from "./serialized-tries";
import {lookUpTldsInTrie} from "./trie/look-up";
import {ValidationError, sanitize, SanitizationResultType} from "./sanitize";
import {TrieRootNode} from "./trie/nodes";
import {parseTrie} from "./trie/parse-trie";

export type Label = string;

export enum ParseResultType {
	Invalid = "INVALID",
	NotListed = "NOT_LISTED",
	Listed = "LISTED",
}

export type ParseResultInvalid = {
	hostname: string;
	type: ParseResultType.Invalid;
	errors: Array<ValidationError>;
};

export type ParseResultNotListed = {
	hostname: string;
	type: ParseResultType.NotListed;
	domains: Array<Label>;
};

type ParseResultListedDomains = {
	subDomains: Array<Label>;
	domain: Label | undefined;
	topLevelDomains: Array<Label>;
};

export type ParseResultListed = ParseResultListedDomains & {
	hostname: string;
	type: ParseResultType.Listed;
	icann: ParseResultListedDomains;
};

export type ParseResult =
	| ParseResultInvalid
	| ParseResultNotListed
	| ParseResultListed;

const getAtIndex = <Item>(
	array: Array<Item>,
	index: number,
): Item | undefined => {
	return index >= 0 && index < array.length ? array[index] : undefined;
};

const splitLabelsIntoDomains = (
	labels: Array<Label>,
	index: number,
): ParseResultListedDomains => {
	return {
		subDomains: labels.slice(0, Math.max(0, index)),
		domain: getAtIndex(labels, index),
		topLevelDomains: labels.slice(index + 1),
	};
};

let parsedIcannTrie: TrieRootNode | undefined;
let parsedPrivateTrie: TrieRootNode | undefined;

/**
 * Splits the given hostname in topLevelDomains, a domain and subDomains.
 */
export const parseDomain = (hostname: string): ParseResult => {
	const sanitizationResult = sanitize(hostname);

	if (sanitizationResult.type === SanitizationResultType.Error) {
		return {
			type: ParseResultType.Invalid,
			hostname,
			errors: sanitizationResult.errors,
		};
	}

	// Parse the serialized trie lazily
	parsedIcannTrie = parsedIcannTrie ?? parseTrie(icannTrie);
	parsedPrivateTrie = parsedPrivateTrie ?? parseTrie(privateTrie);

	const labels = sanitizationResult.labels;
	const icannTlds = lookUpTldsInTrie(labels, parsedIcannTrie);
	const privateTlds = lookUpTldsInTrie(labels, parsedPrivateTrie);

	if (icannTlds.length === 0 && privateTlds.length === 0) {
		return {
			type: ParseResultType.NotListed,
			hostname,
			domains: labels,
		};
	}

	const indexOfPublicSuffixDomain =
		labels.length - Math.max(privateTlds.length, icannTlds.length) - 1;

	const indexOfIcannDomain = labels.length - icannTlds.length - 1;

	return {
		hostname,
		type: ParseResultType.Listed,
		icann: splitLabelsIntoDomains(labels, indexOfIcannDomain),
		...splitLabelsIntoDomains(labels, indexOfPublicSuffixDomain),
	};
};
