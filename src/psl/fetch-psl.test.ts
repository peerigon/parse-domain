import nock from "nock";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { PUBLIC_SUFFIX_URL } from "../config.js";
import { readPslFixture } from "../tests/fixtures/fixtures.js";
import { fetchPsl } from "./fetch-psl.js";

describe("fetchPsl()", () => {
  const publicSuffixUrl = new URL(PUBLIC_SUFFIX_URL);
  let pslFixture: string;

  beforeAll(async () => {
    pslFixture = await readPslFixture();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  test("fetches the public suffix list as text", async () => {
    nock(publicSuffixUrl.origin)
      .get(publicSuffixUrl.pathname)
      .reply(200, pslFixture);

    const list = await fetchPsl();

    expect(list).toEqual(pslFixture);
  });

  test("throws an error if the public suffix list is not long enough", async () => {
    nock(publicSuffixUrl.origin).get(publicSuffixUrl.pathname).reply(200, "");

    const listPromise = fetchPsl();

    await expect(listPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AssertionError: Public suffix list is shorter than expected]`,
    );
  });
});
