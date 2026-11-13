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

  test("ignores nodes that only exist as a path to deeper rules", () => {
    const deepTrie = createTrieFromList(["com", "*.001.test.platform.salesforce.com"]);
    const lookUpDeep = (hostname: string) => lookUpTldsInTrie(hostname.split("."), deepTrie);

    expect(lookUpDeep("salesforce.com")).toEqual(["com"]);
    expect(lookUpDeep("42.salesforce.com")).toEqual(["com"]);
    expect(lookUpDeep("foo.platform.salesforce.com")).toEqual(["com"]);
    expect(lookUpDeep("a.b.001.test.platform.salesforce.com")).toEqual([
      "b",
      "001",
      "test",
      "platform",
      "salesforce",
      "com",
    ]);
  });

  test("only counts deeper path nodes if a rule ends there", () => {
    const privateTrie = createTrieFromList(["github.io"]);

    // Top-level labels count through the PSL's implicit "*" rule
    expect(lookUpTldsInTrie(["example", "io"], privateTrie)).toEqual(["io"]);
    expect(lookUpTldsInTrie(["foo", "github", "io"], privateTrie)).toEqual(["github", "io"]);
  });

  test("does not treat the parent of a nested wildcard rule as a suffix", () => {
    const nested = createTrieFromList(["com", "app", "*.run.app", "*.compute.amazonaws.com"]);
    const lookUpNested = (hostname: string) => lookUpTldsInTrie(hostname.split("."), nested);

    expect(lookUpNested("run.app")).toEqual(["app"]);
    expect(lookUpNested("compute.amazonaws.com")).toEqual(["com"]);
    expect(lookUpNested("x.compute.amazonaws.com")).toEqual(["x", "compute", "amazonaws", "com"]);
  });

  test("ignores a wildcard that is only part of a path", () => {
    const partial = createTrieFromList(["com", "bar.*.foo.com"]);

    expect(lookUpTldsInTrie(["x", "foo", "com"], partial)).toEqual(["com"]);
  });

  test("treats a top-level label as a suffix even without an explicit rule", () => {
    const za = createTrieFromList(["co.za", "ac.za"]);

    expect(lookUpTldsInTrie(["example", "za"], za)).toEqual(["za"]);
    expect(lookUpTldsInTrie(["example", "co", "za"], za)).toEqual(["co", "za"]);
  });
});
