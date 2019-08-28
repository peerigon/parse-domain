import {icannCompleteTrie} from "./tries/icann.complete";
import {privateTrie} from "./tries/private.complete";
import {lookUpTldsInTrie} from "./trie/look-up";
import {Domains} from "./domains";

type ParsedDomain = {
	subdomain?: string;
	domain?: string;
	tld?: string;
};

const lookUpTlds = (domains: Domains): Domains | undefined => {
	const icannTlds = lookUpTldsInTrie(domains, icannCompleteTrie);
	const privateTlds = lookUpTldsInTrie(domains, privateTrie);

	if (privateTlds.length > icannTlds.length) {
		return privateTlds;
	}
	if (icannTlds.length > 0) {
		return icannTlds;
	}

	return undefined;
};

/* eslint-disable jsdoc/no-undefined-types */
/**
 * TODO: Write JSDoc
 */
export const parseDomain = (hostname: string): ParsedDomain => {
	const domains = hostname.toLowerCase().split(".");
	const tlds = lookUpTlds(domains);
	let subdomain;
	let domain;
	let tld;

	if (tlds !== undefined) {
		const indexOfDomain = domains.length - tlds.length - 1;

		tld = tlds.join(".");
		if (indexOfDomain >= 0) {
			domain = domains[indexOfDomain];
			if (indexOfDomain >= 1) {
				subdomain = domains.slice(0, indexOfDomain).join(".");
			}
		}
	}

	return {
		subdomain,
		domain,
		tld,
	};
};
