import type { Label } from "../parse-domain.js";
import * as characters from "./characters.js";
import type { TrieNode } from "./nodes.js";

export const lookUpTldsInTrie = (labels: Array<Label>, trie: TrieNode) => {
  const labelsToCheck = [...labels];
  const tlds: Array<Label> = [];
  let node = trie;

  while (labelsToCheck.length > 0) {
    const label = labelsToCheck.pop()!;
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
