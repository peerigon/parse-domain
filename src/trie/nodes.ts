export const NODE_TYPE_ROOT = Symbol("ROOT");
export const NODE_TYPE_CHILD = Symbol("CHILD");

export type TrieRootNode = {
	type: typeof NODE_TYPE_ROOT;
	children: Map<string, TrieChildNode>;
};
export type TrieChildNode = {
	type: typeof NODE_TYPE_CHILD;
	label: string;
	children: Map<string, TrieChildNode>;
	parent: TrieNode;
};

export type TrieNode = TrieRootNode | TrieChildNode;

export const createRootNode = (): TrieRootNode => {
	return {
		type: NODE_TYPE_ROOT,
		children: new Map(),
	};
};

export const createOrGetChild = (
	parent: TrieNode,
	label: string,
): TrieChildNode => {
	let child = parent.children.get(label);

	if (child === undefined) {
		child = {
			type: NODE_TYPE_CHILD,
			label,
			children: new Map(),
			parent,
		};
		parent.children.set(label, child);
	}

	return child;
};
