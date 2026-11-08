import { describe, expect, test } from "vitest";

import { createTrieFromList } from "./create-trie.js";
import { lookUpTldsInTrie } from "./look-up.js";

describe(lookUpTldsInTrie.name, () => {
  const trie = createTrieFromList(["*.run.app", "*.mtls.run.app", "*.ck", "!www.ck"]);
  const lookUp = (hostname: string) => lookUpTldsInTrie(hostname.split("."), trie);

  test("prefers a nested wildcard over the outer wildcard", () => {
    expect(lookUp("alice.svc1.mtls.run.app")).toEqual(["svc1", "mtls", "run", "app"]);
    expect(lookUp("alice.svc1.other.run.app")).toEqual(["other", "run", "app"]);
  });

  test("handles the explicit label itself", () => {
    expect(lookUp("mtls.run.app")).toEqual(["mtls", "run", "app"]);
  });

  test("still honors exception rules", () => {
    expect(lookUp("www.ck")).toEqual(["ck"]);
    expect(lookUp("a.b.ck")).toEqual(["b", "ck"]);
  });
});
