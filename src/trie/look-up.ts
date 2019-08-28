import * as characters from "./characters";
import {TrieNode} from "./nodes";
import {Domains} from "../domains";

export const lookUpTldsInTrie = (domains: Domains, trie: TrieNode): Domains => {
	const domainsToCheck = domains.slice();
	const tlds: Domains = [];
	let node = trie;

	while (domainsToCheck.length !== 0) {
		const domain = domainsToCheck.pop() as string;

		if (node.children.has(characters.WILDCARD)) {
			if (node.children.has(characters.EXCEPTION + domain)) {
				break;
			}
			node = node.children.get(characters.WILDCARD) as TrieNode;
		} else {
			if (node.children.has(domain) === false) {
				break;
			}
			node = node.children.get(domain) as TrieNode;
		}

		tlds.unshift(domain);
	}

	return tlds;
};
