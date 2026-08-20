import { parseDomain, fromUrl, NO_HOSTNAME } from "../main.js";

const TLDS = [
  "com",
  "org",
  "net",
  "io",
  "dev",
  "co.uk",
  "de",
  "app",
  "info",
  "shop",
  "cloud",
  "xyz",
];
const SUBDOMAINS = ["", "www.", "api.", "shop.blog.", "cdn.assets.", "mail."];

const generateUrls = (count: number): string[] => {
  const urls: string[] = [];

  for (let i = 0; i < count; i++) {
    const tld = TLDS[i % TLDS.length];
    const subdomain = SUBDOMAINS[i % SUBDOMAINS.length];

    urls.push(`https://${subdomain}example-${i}.${tld}/path/${i}?query=${i}`);
  }

  return urls;
};

const URL_COUNT = 23104;
const urls = generateUrls(URL_COUNT);

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

console.log(`Parsed ${URL_COUNT} URLs in ${durationMs.toFixed(2)}ms`);
console.log(`Average: ${(durationMs / URL_COUNT).toFixed(4)}ms per URL`);
