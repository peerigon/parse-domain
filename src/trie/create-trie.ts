import { createOrGetChild, createRootNode, TrieNode } from "./nodes.js";

export const createTrieFromList = (list: Array<string>) => {
  const root = createRootNode();

  for (const rule of list) {
    let node: TrieNode = root;

    for (const label of rule.split(".").reverse()) {
      node = createOrGetChild(node, label);
    }
  }

  return root;
};
