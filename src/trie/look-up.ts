import type { Label } from "../parse-domain.js";
import * as characters from "./characters.js";
import { NODE_TYPE_ROOT, type TrieNode } from "./nodes.js";

export const lookUpTldsInTrie = (labels: Array<Label>, trie: TrieNode): Array<Label> => {
  const labelsToCheck = [...labels];
  const tlds: Array<Label> = [];
  let node = trie;
  // Only labels up to the last node that actually ends a rule are part of the public suffix.
  let ruleLength = 0;

  while (labelsToCheck.length > 0) {
    const label = labelsToCheck.pop()!;
    const labelLowerCase = label.toLowerCase();

    const hasWildcard = node.children.has(characters.WILDCARD);

    if (hasWildcard && node.children.has(characters.EXCEPTION + labelLowerCase)) {
      // The exception rule makes the parent the public suffix, even if it is not a rule itself
      ruleLength = tlds.length;
      break;
    }

    // Explicit children are more specific than a wildcard (e.g. *.mtls.run.app vs. *.run.app),
    // so they must win. The wildcard node has no children, so falling back to it never loses labels.
    const next = node.children.get(labelLowerCase) ?? node.children.get(characters.WILDCARD);

    if (next === undefined) {
      break;
    }
    const parent = node;
    node = next;

    tlds.unshift(label);
    // A node is also a public suffix if a wildcard rule matches it (*.run.app matches mtls.run.app)
    // or if it is a top-level label from the list: the PSL's implicit "*" rule makes it a suffix
    // even without an explicit rule (e.g. za, or ck via *.ck).
    if (
      next.isRule ||
      parent.children.get(characters.WILDCARD)?.isRule === true ||
      parent.type === NODE_TYPE_ROOT
    ) {
      ruleLength = tlds.length;
    }
  }

  return tlds.slice(tlds.length - ruleLength);
};
