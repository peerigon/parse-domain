import { buildTries } from "./build-tries";
import {
  PUBLIC_SUFFIX_MARKER_ICANN_START,
  PUBLIC_SUFFIX_MARKER_ICANN_END,
  PUBLIC_SUFFIX_MARKER_PRIVATE_START,
  PUBLIC_SUFFIX_MARKER_PRIVATE_END,
} from "../config";
import { toASCII } from "../punycode";

describe("buildTries()", () => {
  test("normalizes rules (to punycode, to lower case)", () => {
    const exampleDomain1 = "大分";
    const exampleDomain2 = "ÄäÜü";

    const listContent = [
      PUBLIC_SUFFIX_MARKER_ICANN_START,
      exampleDomain1,
      PUBLIC_SUFFIX_MARKER_ICANN_END,
      PUBLIC_SUFFIX_MARKER_PRIVATE_START,
      exampleDomain2,
      PUBLIC_SUFFIX_MARKER_PRIVATE_END,
    ].join("\n");

    const { icannTrie, privateTrie } = buildTries(listContent);

    expect(icannTrie.children.has(toASCII(exampleDomain1))).toBe(true);
    expect(privateTrie.children.has(toASCII(exampleDomain2))).toBe(true);
  });

  test("throws when the ICANN start marker is missing ", () => {
    const listContent = [""].join("\n");

    expect(() => buildTries(listContent)).toThrowError(
      `Missing start marker ${PUBLIC_SUFFIX_MARKER_ICANN_START} in public suffix list`
    );
  });

  test("throws when the ICANN end marker is missing ", () => {
    const listContent = [PUBLIC_SUFFIX_MARKER_ICANN_START].join("\n");

    expect(() => buildTries(listContent)).toThrowError(
      `Missing end marker ${PUBLIC_SUFFIX_MARKER_ICANN_END} in public suffix list`
    );
  });

  test("throws when the PRIVATE start marker is missing ", () => {
    const listContent = [
      PUBLIC_SUFFIX_MARKER_ICANN_START,
      PUBLIC_SUFFIX_MARKER_ICANN_END,
    ].join("\n");

    expect(() => buildTries(listContent)).toThrowError(
      `Missing start marker ${PUBLIC_SUFFIX_MARKER_PRIVATE_START} in public suffix list`
    );
  });

  test("throws when the PRIVATE end marker is missing ", () => {
    const listContent = [
      PUBLIC_SUFFIX_MARKER_ICANN_START,
      PUBLIC_SUFFIX_MARKER_ICANN_END,
      PUBLIC_SUFFIX_MARKER_PRIVATE_START,
    ].join("\n");

    expect(() => buildTries(listContent)).toThrowError(
      `Missing end marker ${PUBLIC_SUFFIX_MARKER_PRIVATE_END} in public suffix list`
    );
  });
});
