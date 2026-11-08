import type { Label } from "../parse-domain.js";
import * as characters from "./characters.js";
import type { TrieNode } from "./nodes.js";

export const lookUpTldsInTrie = (labels: Array<Label>, trie: TrieNode): Array<Label> => {
  const labelsToCheck = [...labels];
  const tlds: Array<Label> = [];
  let node = trie;

  while (labelsToCheck.length > 0) {
    const label = labelsToCheck.pop()!;
    const labelLowerCase = label.toLowerCase();

    const hasWildcard = node.children.has(characters.WILDCARD);

    if (hasWildcard && node.children.has(characters.EXCEPTION + labelLowerCase)) {
      break;
    }

    // Explicit children are more specific than a wildcard (e.g. *.mtls.run.app vs. *.run.app),
    // so they must win. The wildcard node has no children, so falling back to it never loses labels.
    const next = node.children.get(labelLowerCase) ?? node.children.get(characters.WILDCARD);

    if (next === undefined) {
      break;
    }
    node = next;

    tlds.unshift(label);
  }

  return tlds;
};
