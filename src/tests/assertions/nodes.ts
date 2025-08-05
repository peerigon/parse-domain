import { expect } from "vitest";
import {
  NODE_TYPE_CHILD,
  NODE_TYPE_ROOT,
  type TrieChildNode,
  type TrieNode,
  type TrieRootNode,
} from "../../trie/nodes.js";

export const expectRoot = ({
  root,
  childrenSize,
}: {
  root: TrieRootNode;
  childrenSize: number;
}) => {
  expect(root.type).toBe(NODE_TYPE_ROOT);
  expect(root.children.size).toBe(childrenSize);
};

export const expectChild = ({
  child,
  parent,
  domain,
  childrenSize,
}: {
  child: TrieChildNode;
  domain: string;
  childrenSize: number;
  parent: TrieNode;
}) => {
  expect(child.type).toBe(NODE_TYPE_CHILD);
  expect(child.label).toBe(domain);
  expect(child.children.size).toBe(childrenSize);
  expect(child.parent).toBe(parent);
};
