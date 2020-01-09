import {toASCII} from "punycode";
import {TrieRootNode, TrieChildNode} from "./nodes";
import {DOWN, UP, SAME} from "./characters";

export const serializeTrie = (root: TrieRootNode): string => {
	// TODO: Add link to issue in comment
	/*
	A trie might look like this:

	                root
	                 |
	   +-------+-----+-----+-----------+
	   |       |           |           |
	 com      uk          jp         موقع
	          |           |
	       +--+--+     +--+--+
	       |    |      |     |
	      co   gov   静岡   岐阜

	And the textual representation of the trie looks like this:
	com|uk>co,gov|jp>静岡,岐阜|موقع

	You might ask: what about those funny characters? And you're right, there's a problem:

	Users of parse-domain should only pass parsed hostnames (e.g. via new URL("...").hostname)
	to parseDomain(). This frees us from the burden of URL parsing.
	The problem is that new URL("...").hostname will also translate all non-ASCII characters
	into punycode (e.g. 大分.jp becomes xn--kbrq7o.jp). This means for us that our serialized
	trie should only contain punycode hostnames.

	The downside of this is that punycode hostnames are bigger in terms of file size,
	but that's still better than including a punycode library into the runtime code of parse-domain.
	Gzip is also very effective in removing duplicate characters.
	*/
	type QueueItem = TrieChildNode | typeof UP;
	let serialized = "";
	const queue: Array<QueueItem> = Array.from(root.children.values());
	let current: QueueItem | undefined;

	while ((current = queue.shift()) !== undefined) {
		if (current === UP) {
			serialized += UP;
			continue;
		}
		serialized += toASCII(current.domain);
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
};
