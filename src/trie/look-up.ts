import * as characters from "./characters";
import {TrieNode} from "./nodes";
import {Labels} from "../parse-domain";

export const lookUpTldsInTrie = (labels: Labels, trie: TrieNode) => {
	const labelsToCheck = labels.slice();
	const tlds: Labels = [];
	let node = trie;

	while (labelsToCheck.length !== 0) {
		const label = labelsToCheck.pop() as string;
		const labelLowerCase = label.toLowerCase();

		if (node.children.has(characters.WILDCARD)) {
			if (node.children.has(characters.EXCEPTION + labelLowerCase)) {
				break;
			}
			node = node.children.get(characters.WILDCARD) as TrieNode;
		} else {
			if (node.children.has(labelLowerCase) === false) {
				break;
			}
			node = node.children.get(labelLowerCase) as TrieNode;
		}

		tlds.unshift(label);
	}

	return tlds;
};
