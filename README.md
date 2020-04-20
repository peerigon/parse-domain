# parse-domain

**Splits a hostname into subdomains, domain and (effective) top-level domains. Written in TypeScript.**

[![Version on NPM](https://img.shields.io/npm/v/parse-domain?style=for-the-badge)](https://www.npmjs.com/package/parse-domain)
[![Semantically released](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)
[![Monthly downloads on NPM](https://img.shields.io/npm/dm/parse-domain?style=for-the-badge)](https://www.npmjs.com/package/parse-domain)
[![Dependencies status](https://img.shields.io/david/peerigon/parse-domain?style=for-the-badge)](https://david-dm.org/peerigon/parse-domain)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/parse-domain?style=for-the-badge)](https://snyk.io/test/github/peerigon/parse-domain)
[![Coverage Status](https://img.shields.io/coveralls/github/peerigon/parse-domain?style=for-the-badge)](https://coveralls.io/github/peerigon/parse-domain?branch=master)
[![License](https://img.shields.io/npm/l/parse-domain?style=for-the-badge)](https://unlicense.org/)

Since domain name registrars organize their namespaces in different ways, it's not straight-forward to recognize subdomains, the domain and top-level domains in a hostname. **parse-domain** validates the given hostname against [RFC 1034](https://tools.ietf.org/html/rfc1034) and uses a [large list of known top-level domains](https://publicsuffix.org/list/public_suffix_list.dat) from publicsuffix.org to split a hostname into subdomains, domain and top-level domains:

```javascript
import {parseDomain} from "parse-domain";

const {subDomains, domain, topLevelDomains} = parseDomain(
	// This should be a string with basic latin characters only.
	// More information below.
	"www.some.example.co.uk",
);

console.log(subDomains); // ["www", "some"]
console.log(domain); // "example"
console.log(topLevelDomains); // ["co", "uk"]
```

This module uses a [trie](https://en.wikipedia.org/wiki/Trie) data structure under the hood to ensure the smallest possible library size and the fastest lookup. The library is roughly 30KB minified and gzipped.

This module also assumes an ES2015 environment. You need to transpile it down to ES5 (e.g. by using [Babel](https://babeljs.io/)) if you need to support older environments.

<br />

## Installation

```sh
npm install parse-domain
```

## Updates

💡 **Please note:** publicsuffix.org is updated several times per month. This package comes with a prebuilt list that has been downloaded at the time of `npm publish`. In order to get an up-to-date list, you should run `npx parse-domain-update` everytime you start or build your application. This will download the latest list from `https://publicsuffix.org/list/public_suffix_list.dat`.

<br />

## Expected input

**⚠️ [`parseDomain`](#api-js-parseDomain) does not parse whole URLs**. You should only pass the [puny-encoded](https://en.wikipedia.org/wiki/Punycode) hostname section of the URL:

| ❌ Wrong                                       | ✅ Correct           |
| ---------------------------------------------- | -------------------- |
| `https://user@www.example.com:8080/path?query` | `www.example.com`    |
| `münchen.de`                                   | `xn--mnchen-3ya.de`  |
| `食狮.com.cn?query`                            | `xn--85x722f.com.cn` |

There is the utility function [`fromUrl`](#api-js-fromUrl) which tries to extract the hostname from a (partial) URL and puny-encodes it:

```javascript
import {parseDomain, fromUrl} from "parse-domain";

const {subDomains, domain, topLevelDomains} = parseDomain(
	fromUrl("https://www.münchen.de?query"),
);

console.log(subDomains); // ["www"]
console.log(domain); // "xn--mnchen-3ya"
console.log(topLevelDomains); // ["de"]

// You can use the 'punycode' NPM package to decode the domain again
import {toUnicode} from "punycode";

console.log(toUnicode(domain)); // "münchen"
```

[`fromUrl`](#api-js-fromUrl) uses the `URL` constructor under the hood. Depending on your target environments you need to make sure that there is a polyfill for it. It's globally available in [all modern browsers](https://caniuse.com/#feat=url) (no IE) and in [Node v10](https://nodejs.org/api/url.html#url_class_url).

## Expected output

When parsing a domain there are 4 possible results:

- invalid
- formally correct and the domain name
  - is reserved
  - is not listed in the public suffix list
  - is listed

[`parseDomain`](#api-js-parseDomain) returns a [`ParseResult`](#api-ts-ParseResult) with a `type` property that allows to distinguish these cases.

### 👉 Invalid domains

The given input is first validated against [RFC 1034](https://tools.ietf.org/html/rfc1034). If the validation fails, `parseResult.type` will be `ParseResultType.Invalid`:

```javascript
import {parseDomain, ParseResultType} from "parse-domain";

const parseResult = parseDomain("münchen.de");

console.log(parseResult.type === ParseResultType.Invalid); // true
```

Check out the [API](#api-ts-ValidationError) if you need more information about the validation error.

### 👉 Reserved domains

There are 5 top-level domains that are not listed in the public suffix list but reserved according to [RFC 6761](https://tools.ietf.org/html/rfc6761) and [RFC 6762](https://tools.ietf.org/html/rfc6762):

- `localhost`
- `local`
- `example`
- `invalid`
- `test`

In these cases, `parseResult.type` will be `ParseResultType.Reserved`:

```javascript
import {parseDomain, ParseResultType} from "parse-domain";

const parseResult = parseDomain("pecorino.local");

console.log(parseResult.type === ParseResultType.Reserved); // true
console.log(parseResult.domains); // ["pecorino", "local"]
```

### 👉 Domains that are not listed

If the given hostname is valid, but not listed in the downloaded public suffix list, `parseResult.type` will be `ParseResultType.NotListed`:

```javascript
import {parseDomain, ParseResultType} from "parse-domain";

const parseResult = parseDomain("this.is.not-listed");

console.log(parseResult.type === ParseResultType.NotListed); // true
console.log(parseResult.domains); // ["this", "is", "not-listed"]
```

If a domain is not listed, it can be caused by an outdated list. Make sure to [update the list once in a while](#installation).

⚠️ **Do not treat parseDomain as authoritative answer.** It cannot replace a real DNS lookup to validate if a given domain is known in a certain network.

### 👉 Effective top-level domains

Technically, the term _top-level domain_ describes the very last domain in a hostname (`uk` in `example.co.uk`). Most people, however, use the term _top-level domain_ for the _public suffix_ which is a namespace ["under which Internet users can directly register names"](https://publicsuffix.org/).

Some examples for public suffixes:

- `com` in `example.com`
- `co.uk` in `example.co.uk`
- `co` in `example.co`
- `com.co` in `example.com.co`

If the hostname contains domains from the public suffix list, the `parseResult.type` will be `ParseResultType.Listed`:

```javascript
import {parseDomain, ParseResultType} from "parse-domain";

const parseResult = parseDomain("example.co.uk");

console.log(parseResult.type === ParseResultType.Listed); // true
console.log(parseResult.domains); // ["example", "co", "uk"]
```

Now `parseResult` will also provide a `subDomains`, `domain` and `topLevelDomains` property:

```javascript
const {subDomains, domain, topLevelDomains} = parseResult;

console.log(subDomains); // []
console.log(domain); // "example"
console.log(topLevelDomains); // ["co", "uk"]
```

### 👉 Switch over `parseResult.type` to distinguish between different parse results

We recommend switching over the `parseResult.type`:

```javascript
switch (parseResult.type) {
	case ParseResultType.Listed: {
		const {hostname, topLevelDomains} = parseResult;

		console.log(`${hostname} belongs to ${topLevelDomains.join(".")}`);
		break;
	}
	case ParseResultType.Reserved:
	case ParseResultType.NotListed: {
		const {hostname} = parseResult;

		console.log(`${hostname} is a reserved or unknown domain`);
		break;
	}
	default:
		throw new Error(`${hostname} is an invalid domain`);
}
```

### ⚠️ Effective top-level domains vs. ICANN

What's surprising to a lot of people is that the definition of public suffix means that regular business domains can become effective top-level domains:

```javascript
const {subDomains, domain, topLevelDomains} = parseDomain(
	"parse-domain.github.io",
);

console.log(subDomains); // []
console.log(domain); // "parse-domain"
console.log(topLevelDomains); // ["github", "io"] 🤯
```

In this case `github.io` is nothing else than a private domain name registrar. `github.io` is the _effective_ top-level domain and browsers are treating it like that.

If you're only interested in top-level domains listed in the [ICANN](https://en.wikipedia.org/wiki/ICANN) section of the public suffix list, there's an `icann` property:

```javascript
const parseResult = parseDomain("parse-domain.github.io");
const {subDomains, domain, topLevelDomains} = parseResult.icann;

console.log(subDomains); // ["parse-domain"]
console.log(domain); // "github"
console.log(topLevelDomains); // ["io"]
```

### ⚠️ `domain` can also be `undefined`

```javascript
const {subDomains, domain, topLevelDomains} = parseDomain("co.uk");

console.log(subDomains); // []
console.log(domain); // undefined
console.log(topLevelDomains); // ["co", "uk"]
```

### ⚠️ `""` is a valid (but reserved) domain

The empty string `""` represents the [DNS root](https://en.wikipedia.org/wiki/DNS_root_zone) and is considered to be valid. `parseResult.type` will be `ParseResultType.Reserved` in that case:

```javascript
const parseResult = parseDomain("");

console.log(parseResult.type === ParseResultType.Reserved); // true
console.log(subDomains); // []
console.log(domain); // undefined
console.log(topLevelDomains); // []
```

## API

🧩 = JavaScript export<br>
🧬 = TypeScript export

<h3 id="api-js-parseDomain">
🧩 <code>export parseDomain(hostname: string | typeof <a href="#api-js-NO_HOSTNAME">NO_HOSTNAME</a>): <a href="#api-ts-ParseResult">ParseResult</a></code>
</h3>

Takes a hostname (e.g. `"www.example.com"`) and returns a [`ParseResult`](#api-ts-ParseResult). The hostname must only contain letters, digits, hyphens and dots. International hostnames must be puny-encoded. Does not throw an error, even with invalid input.

```javascript
import {parseDomain} from "parse-domain";

const parseResult = parseDomain("www.example.com");
```

<h3 id="api-js-fromUrl">
🧩 <code>export fromUrl(input: string): string | typeof <a href="#api-js-NO_HOSTNAME">NO_HOSTNAME</a></code>
</h3>

Takes a URL-like string and tries to extract the hostname. Requires the global [`URL` constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL) to be available on the platform. Returns the [`NO_HOSTNAME`](#api-js-NO_HOSTNAME) symbol if the input was not a string or the hostname could not be extracted. Take a look [at the test suite](/blob/master/src/from-url.test.ts) for some examples. Does not throw an error, even with invalid input.

<h3 id="api-js-NO_HOSTNAME">
🧩 <code>export NO_HOSTNAME: unique symbol</code>
</h3>

`NO_HOSTNAME` is a symbol that is returned by [`fromUrl`](#api-js-fromUrl) when it was not able to extract a hostname from the given string. When passed to [`parseDomain`](#api-js-parseDomain), it will always yield a [`ParseResultInvalid`](#api-ts-ParseResultInvalid).

<h3 id="api-ts-ParseResult">
🧬 <code>export ParseResult</code>
</h3>

A `ParseResult` is either a [`ParseResultInvalid`](#api-ts-ParseResultInvalid), [`ParseResultReserved`](#api-ts-ParseResultReserved), [`ParseResultNotListed`](#api-ts-ParseResultNotListed) or [`ParseResultListed`](#api-ts-ParseResultListed).

All parse results have a `type` property that is either `"INVALID"`, `"RESERVED"`, `"NOT_LISTED"` or `"LISTED"`. Use the exported [ParseResultType](#api-js-ParseResultType) to check for the type instead of checking against string literals.

All parse results also have a `hostname` property that stores the original hostname that was passed to [`parseDomain`](#api-js-parseDomain).

<h3 id="api-js-ParseResultType">
🧩 <code>export ParseResultType</code>
</h3>

An object that holds all possible [ParseResult](#api-ts-ParseResult) `type` values:

```javascript
const ParseResultType = {
	Invalid: "INVALID",
	Reserved: "RESERVED",
	NotListed: "NOT_LISTED",
	Listed: "LISTED",
};
```

<h3 id="api-ts-ParseResultType">
🧬 <code>export ParseResultType</code>
</h3>

This type represents all possible [ParseResult](#api-ts-ParseResult) `type` values.

<h3 id="api-ts-ParseResultInvalid">
🧬 <code>export ParseResultInvalid</code>
</h3>

Describes the shape of the parse result that is returned when the given hostname does not adhere to [RFC 1034](https://tools.ietf.org/html/rfc1034):

- The hostname is not a string
- The hostname is longer than 253 characters
- A domain label is shorter than 1 character
- A domain label is longer than 63 characters
- A domain label contains a character that is not a letter, digit or hyphen

```ts
type ParseResultInvalid = {
	type: ParseResultType.INVALID;
	hostname: string | typeof NO_HOSTNAME;
	errors: Array<ValidationError>;
};

// Example

{
	type: "INVALID",
	hostname: ".com",
	errors: [...]
}
```

<h3 id="api-ts-ValidationError">
🧬 <code>export ValidationError</code>
</h3>

Describes the shape of a validation error as returned by [`parseDomain`](#api-js-parseDomain)

```ts
type ValidationError = {
	type: ValidationErrorType;
	message: string;
	column: number;
};

// Example

{
	type: "LABEL_MIN_LENGTH",
	message: `Label "" is too short. Label is 0 octets long but should be at least 1.`,
	column: 1,
}
```

<h3 id="api-js-ValidationErrorType">
🧩 <code>export ValidationErrorType</code>
</h3>

An object that holds all possible [ValidationError](#api-ts-ValidationError) `type` values:

```javascript
const ValidationErrorType = {
	NoHostname: "NO_HOSTNAME",
	DomainMaxLength: "DOMAIN_MAX_LENGTH",
	LabelMinLength: "LABEL_MIN_LENGTH",
	LabelMaxLength: "LABEL_MAX_LENGTH",
	LabelInvalidCharacter: "LABEL_INVALID_CHARACTER",
};
```

<h3 id="api-ts-ValidationErrorType">
🧬 <code>export ValidationErrorType</code>
</h3>

This type represents all possible `type` values of a [ValidationError](#api-ts-ValidationError).

<h3 id="api-ts-ParseResultReserved">
🧬 <code>export ParseResultReserved</code>
</h3>

This type describes the shape of the parse result that is returned when the given hostname

- is the root domain (the empty string `""`)
- belongs to the top-level domain `localhost`, `local`, `example`, `invalid` or `test`

```ts
type ParseResultReserved = {
	type: ParseResultType.Reserved;
	hostname: string;
	domains: Array<string>;
};

// Example

{
	type: "RESERVED",
	hostname: "pecorino.local",
	domains: ["pecorino", "local"]
}
```

<h3 id="api-ts-ParseResultNotListed">
🧬 <code>export ParseResultNotListed</code>
</h3>

Describes the shape of the parse result that is returned when the given hostname is valid and does not belong to a reserved top-level domain, but is not listed in the public suffix list.

```ts
type ParseResultNotListed = {
	type: ParseResultType.NotListed;
	hostname: string;
	domains: Array<string>;
};

// Example

{
	type: "NOT_LISTED",
	hostname: "this.is.not-listed",
	domains: ["this", "is", "not-listed"]
}
```

<h3 id="api-ts-ParseResultListed">
🧬 <code>export ParseResultListed</code>
</h3>

Describes the shape of the parse result that is returned when the given hostname belongs to a top-level domain that is listed in the public suffix list:

```ts
type ParseResultListed = {
	type: ParseResultType.Listed;
	hostname: string;
	domains: Array<string>;
	subDomains: Array<string>;
	domain: string | undefined;
	topLevelDomains: Array<string>;
	icann: {
		subDomains: Array<string>;
		domain: string | undefined;
		topLevelDomains: Array<string>;
	};
};

// Example

{
	type: "LISTED",
	hostname: "parse-domain.github.io",
	domains: ["parse-domain", "github", "io"]
	subDomains: [],
	domain: "parse-domain",
	topLevelDomains: ["github", "io"],
	icann: {
		subDomains: ["parse-domain"],
		domain: "github",
		topLevelDomains: ["io"]
	}
}
```

## License

Unlicense

## Sponsors

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com)
