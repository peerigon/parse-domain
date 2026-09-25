import { parseDomain, fromUrl, NO_HOSTNAME } from "../main.js";
// Extracted from https://github.com/stevenvachon/url-relation/blob/main/test/helpers/tests.json
// (all `url1`/`url2` values across all test cases, duplicates included).
import urls from "./fixtures/url-relation-test-urls.json" with { type: "json" };

// Warm up: the trie is parsed lazily on the first parseDomain() call and then
// memoized, so exclude that one-time cost from the measured loop below.
parseDomain("example.com");

const start = performance.now();

for (const url of urls) {
  const hostname = fromUrl(url);

  if (hostname !== NO_HOSTNAME) {
    parseDomain(hostname);
  }
}

const end = performance.now();
const durationMs = end - start;

console.log(`Parsed ${urls.length} URLs in ${durationMs.toFixed(2)}ms`);
console.log(`Average: ${(durationMs / urls.length).toFixed(4)}ms per URL`);
