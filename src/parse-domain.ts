import {icannTrie, privateTrie} from "./serialized-tries";
import {lookUpTldsInTrie} from "./trie/look-up";
import {ValidationError, sanitize, SanitizationResultType} from "./sanitize";
import {TrieRootNode} from "./trie/nodes";
import {parseTrie} from "./trie/parse-trie";
import {NO_HOSTNAME} from "./from-url";

export const RESERVED_TOP_LEVEL_DOMAINS = [
	"localhost",
	"local",
	"example",
	"invalid",
	"test",
];

export type Label = string;

export enum ParseResultType {
	/**
	 * This parse result is returned in case the given hostname does not adhere to [RFC 1034](https://tools.ietf.org/html/rfc1034).
	 */
	Invalid = "INVALID",
	Reserved = "RESERVED",
	NotListed = "NOT_LISTED",
	Listed = "LISTED",
}

type ParseResultCommon<Type extends ParseResultType> = {
	/**
	 * The type of the parse result. Use switch or if to distinguish between different results.
	 */
	type: Type;
	/**
	 * The original hostname that was passed to parseDomain().
	 */
	hostname: Type extends ParseResultType.Invalid
		? string | typeof NO_HOSTNAME
		: string;
};

export type ParseResultInvalid = ParseResultCommon<ParseResultType.Invalid> & {
	/**
	 * An array of validation errors.
	 */
	errors: Array<ValidationError>;
};

type ParseResultCommonValid = {
	/**
	 * An array with labels that were separated by a dot character in the given hostname.
	 */
	domains: Array<Label>;
};

export type ParseResultReserved = ParseResultCommon<ParseResultType.Reserved> &
	ParseResultCommonValid;

export type ParseResultNotListed = ParseResultCommon<
	ParseResultType.NotListed
> &
	ParseResultCommonValid;

type ParseResultListedDomains = ParseResultCommonValid & {
	/**
	 * An array of labels that belong to the subdomain. Can be empty if there was no subdomain in the given hostname.
	 */
	subDomains: Array<Label>;
	/**
	 * The first label that belongs to the user-controlled section of the hostname. Can be undefined if just a top-level domain was passed to parseDomain().
	 */
	domain: Label | undefined;
	/**
	 * An array of labels that are controlled by the domain registrar.
	 */
	topLevelDomains: Array<Label>;
};

export type ParseResultListed = ParseResultCommon<ParseResultType.Listed> &
	ParseResultListedDomains & {
		/**
		 * The parse result according to ICANN only without private top-level domains.
		 */
		icann: ParseResultListedDomains;
	};

export type ParseResult =
	| ParseResultInvalid
	| ParseResultReserved
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
		domains: labels,
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
export const parseDomain = (
	input: string | typeof NO_HOSTNAME,
): ParseResult => {
	const sanitizationResult = sanitize(input);

	if (sanitizationResult.type === SanitizationResultType.Error) {
		return {
			type: ParseResultType.Invalid,
			hostname: input,
			errors: sanitizationResult.errors,
		};
	}

	const {originalInput: hostname, labels} = sanitizationResult;

	if (
		hostname === "" ||
		RESERVED_TOP_LEVEL_DOMAINS.includes(labels[labels.length - 1])
	) {
		return {
			type: ParseResultType.Reserved,
			hostname,
			domains: labels,
		};
	}

	// Parse the serialized trie lazily
	parsedIcannTrie = parsedIcannTrie ?? parseTrie(icannTrie);
	parsedPrivateTrie = parsedPrivateTrie ?? parseTrie(privateTrie);

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
