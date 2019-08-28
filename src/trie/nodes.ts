export const NODE_TYPE_ROOT = Symbol("ROOT");
export const NODE_TYPE_CHILD = Symbol("CHILD");

export type TrieRootNode = {
	type: typeof NODE_TYPE_ROOT;
	children: Map<string, TrieChildNode>;
};
export type TrieChildNode = {
	type: typeof NODE_TYPE_CHILD;
	domain: string;
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

export const createOrGetChild = (parent: TrieNode, domain: string): TrieChildNode => {
	let child = parent.children.get(domain);

	if (child === undefined) {
		if (parent.children.has(domain)) {
			throw new Error(
				`Cannot adopt child: parent has already a child with the domain '${domain}'`,
			);
		}
		child = {
			type: NODE_TYPE_CHILD,
			domain,
			children: new Map(),
			parent,
		};
		parent.children.set(domain, child);
		child.parent = parent;
	}

	return child;
};
