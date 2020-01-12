import {TrieRootNode, createRootNode, createOrGetChild, TrieNode} from "./nodes";

export const createTrieFromList = (list: Array<string>): TrieRootNode => {
	const root = createRootNode();

	for (const rule of list) {
		let node: TrieNode = root;

		for (const label of rule.split(".").reverse()) {
			node = createOrGetChild(node, label);
		}
	}

	return root;
};
