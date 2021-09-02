import nock from "nock";
import { PUBLIC_SUFFIX_URL } from "../config";
import { fetchPsl } from "./fetch-psl";
import { readPslFixture } from "../tests/fixtures/fixtures";

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
      `"Public suffix list is shorter than expected"`
    );
  });
});
