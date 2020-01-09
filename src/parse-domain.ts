import {icannCompleteTrie} from "./tries/icann";
import {privateTrie} from "./tries/private";
import {lookUpTldsInTrie} from "./trie/look-up";
import {ValidationError, sanitize, SanitizationResultType} from "./sanitize";

export type Labels = Array<string>;

export enum ParseResultType {
	Invalid,
	NotListed,
	Listed,
}

export type ParseResultInvalid = {
	hostname: string;
	type: ParseResultType.Invalid;
	errors: Array<ValidationError>;
};

export type ParseResultNotListed = {
	hostname: string;
	type: ParseResultType.NotListed;
	domains: Labels;
};

type ParseResultListedDomains = {
	subDomains: Labels;
	domain: string | undefined;
	topLevelDomains: Labels;
};

export type ParseResultListed = ParseResultListedDomains & {
	hostname: string;
	type: ParseResultType.Listed;
	icann: ParseResultListedDomains;
};

export type ParseResult = ParseResultInvalid | ParseResultNotListed | ParseResultListed;

const getAtIndex = <Item>(array: Array<Item>, index: number): Item | undefined => {
	return index >= 0 && index < array.length ? array[index] : undefined;
};

const splitLabelsIntoDomains = (labels: Labels, index: number): ParseResultListedDomains => {
	return {
		subDomains: labels.slice(0, Math.max(0, index)),
		domain: getAtIndex(labels, index),
		topLevelDomains: labels.slice(index + 1),
	};
};

/* eslint-disable jsdoc/no-undefined-types */
/**
 * TODO: Write JSDoc
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

	const labels = sanitizationResult.labels;
	const icannTlds = lookUpTldsInTrie(labels, icannCompleteTrie);
	const privateTlds = lookUpTldsInTrie(labels, privateTrie);

	if (icannTlds.length === 0 && privateTlds.length === 0) {
		return {
			type: ParseResultType.NotListed,
			hostname,
			domains: labels,
		};
	}

	const indexOfPublicSuffixDomain = labels.length - Math.max(privateTlds.length, icannTlds.length) - 1;
	const indexOfIcannDomain = labels.length - icannTlds.length - 1;

	return {
		hostname,
		type: ParseResultType.Listed,
		icann: splitLabelsIntoDomains(labels, indexOfIcannDomain),
		...splitLabelsIntoDomains(labels, indexOfPublicSuffixDomain),
	};
};
