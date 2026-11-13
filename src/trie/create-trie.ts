import { createOrGetChild, createRootNode, type TrieNode, type TrieRootNode } from "./nodes.js";

export const createTrieFromList = (list: Array<string>): TrieRootNode => {
  const root = createRootNode();

  for (const rule of list) {
    let node: TrieNode = root;

    // We do not want to break compatibility with older engines unnecessarily.
    // eslint-disable-next-line unicorn/no-array-reverse
    const labels = rule.split(".").reverse();

    for (const [index, label] of labels.entries()) {
      const isLast = index === labels.length - 1;

      node = createOrGetChild(node, label, isLast);
      if (isLast) {
        node.isRule = true;
      }
    }
  }

  return root;
};
