import {TrieRootNode, TrieNode, NODE_TYPE_CHILD, TrieChildNode} from "./nodes";
import {DOWN, UP, matchSeparatorsAtStringEnd, SAME} from "./characters";

const serializeSubTrie = (node: TrieNode): string => {
	return Array.from(node.children.values(), (child): string => {
		// Since the depth of our tries is usually never higher than 5 recursion is ok here
		const serializedChild = serializeSubTrie(child);

		return child.domain + (serializedChild === "" ? "" : (DOWN + serializedChild + UP));
	}).join(",");
};

export const serializeTrie = (root: TrieRootNode): string => {
	type QueueItem = TrieChildNode | typeof UP | undefined;
	/**
	 * A trie might look like this:
	 *
	 *                root
	 *                 |
	 *   +-------+-----+-----+-----------+
	 *   |       |           |           |
	 * com      uk          jp         موقع
	 *          |           |
	 *       +--+--+     +--+--+
	 *       |    |      |     |
	 *      co   gov   静岡   岐阜
	 *
	 * And the textual representation of the trie looks like this:
	 * com|uk>co,gov|jp>静岡,岐阜|موقع
	 */
	let serialized = "";
	const queue: Array<QueueItem> = Array.from(root.children.values());
	let current: QueueItem;

	while ((current = queue.shift()) !== undefined) {
		if (current === UP) {
			serialized += UP;
			continue;
		}
		serialized += current.domain;
		if (current.children.size === 0) {
			if (queue.length > 0 && queue[0] !== UP) {
				serialized += SAME;
			}
			continue;
		}
		serialized += DOWN;

		const newItems: Array<QueueItem> = Array.from(current.children.values());

		if (queue.length > 0) {
			newItems.push(UP);
		}
		queue.unshift(...newItems);
	}

	return serialized;

	// return serializeSubTrie(root)
	// 	.replace(matchSeparatorsAtStringEnd, "")
	// 	// UP + SAME is the result of our "stupid" join() and can be simplified to just UP
	// 	.replace(UP + SAME, UP);
};
