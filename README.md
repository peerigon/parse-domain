# parse-domain

**Splits a hostname into subdomains, domain and (effective) top-level domains.**

[![Version on NPM](https://img.shields.io/npm/v/parse-domain?style=for-the-badge)](https://www.npmjs.com/package/parse-domain)
[![Semantically released](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)
[![Monthly downloads on NPM](https://img.shields.io/npm/dm/parse-domain?style=for-the-badge)](https://www.npmjs.com/package/parse-domain)<br>
[![NPM Bundle size minified](https://img.shields.io/bundlephobia/min/parse-domain?style=for-the-badge)](https://bundlephobia.com/result?p=parse-domain)
[![NPM Bundle size minified and gzipped](https://img.shields.io/bundlephobia/minzip/parse-domain?style=for-the-badge)](https://bundlephobia.com/result?p=parse-domain)<br>
[![License](https://img.shields.io/npm/l/parse-domain?style=for-the-badge)](./LICENSE)

Since domain name registrars organize their namespaces in different ways, it's not straight-forward to split a hostname into subdomains, the domain and top-level domains. In order to do that **parse-domain** uses a [large list of known top-level domains](https://publicsuffix.org/list/public_suffix_list.dat) from [publicsuffix.org](https://publicsuffix.org/):

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain(
  // This should be a string with basic latin letters only.
  // More information below.
  "www.some.example.co.uk",
);

// Check if the domain is listed in the public suffix list
if (parseResult.type === ParseResultType.Listed) {
  const { subDomains, domain, topLevelDomains } = parseResult;

  console.log(subDomains); // ["www", "some"]
  console.log(domain); // "example"
  console.log(topLevelDomains); // ["co", "uk"]
} else {
  // Read more about other parseResult types below...
}
```

This package has been designed for modern Node and browser environments with ECMAScript modules support. It assumes an ES2015 environment with [`Symbol()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and [`TextDecoder()`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) globally available. You need to transpile it down to ES5 (e.g. by using [Babel](https://babeljs.io/)) if you need to support older environments.

The list of top-level domains is stored in a [trie](https://en.wikipedia.org/wiki/Trie) data structure and serialization format to ensure the fastest lookup and the smallest possible library size.

<br />

## Installation

```sh
npm install parse-domain
```

## Updates

💡 **Please note:** [publicsuffix.org](https://publicsuffix.org/) is updated several times per month. This package comes with a prebuilt list that has been downloaded at the time of `npm publish`. In order to get an up-to-date list, you should run `npx parse-domain-update` everytime you start or build your application. This will download the latest list from `https://publicsuffix.org/list/public_suffix_list.dat`.

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
import { parseDomain, fromUrl } from "parse-domain";

const { subDomains, domain, topLevelDomains } = parseDomain(
  fromUrl("https://www.münchen.de?query"),
);

console.log(subDomains); // ["www"]
console.log(domain); // "xn--mnchen-3ya"
console.log(topLevelDomains); // ["de"]

// You can use the 'punycode' NPM package to decode the domain again
import { toUnicode } from "punycode";

console.log(toUnicode(domain)); // "münchen"
```

[`fromUrl`](#api-js-fromUrl) parses the URL using [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL). Depending on your target environments you need to make sure that there is a [polyfill](https://www.npmjs.com/package/whatwg-url) for it. It's globally available in [all modern browsers](https://caniuse.com/#feat=url) (no IE) and in [Node v10](https://nodejs.org/api/url.html#url_class_url).

## Expected output

When parsing a hostname there are 5 possible results:

- invalid
- it is an ip address
- it is formally correct and the domain is
  - reserved
  - not listed in the public suffix list
  - listed in the public suffix list

[`parseDomain`](#api-js-parseDomain) returns a [`ParseResult`](#api-ts-ParseResult) with a `type` property that allows to distinguish these cases.

### 👉 Invalid domains

The given input is first validated against [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696#section-2) (the domain labels are limited to basic latin letters, numbers and hyphens). If the validation fails, `parseResult.type` will be `ParseResultType.Invalid`:

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain("münchen.de");

console.log(parseResult.type === ParseResultType.Invalid); // true
```

Check out the [API](#api-ts-ValidationError) if you need more information about the validation error.

If you don't want the characters to be validated (e.g. because you need to allow underscores in hostnames), there's also a more relaxed validation mode (according to [RFC 2181](https://www.rfc-editor.org/rfc/rfc2181#section-11)).

```javascript
import { parseDomain, ParseResultType, Validation } from "parse-domain";

const parseResult = parseDomain("_jabber._tcp.gmail.com", {
  validation: Validation.Lax,
});

console.log(parseResult.type === ParseResultType.Listed); // true
```

See also [#134](https://github.com/peerigon/parse-domain/issues/134) for the discussion.

### 👉 IP addresses

If the given input is an IP address, `parseResult.type` will be `ParseResultType.Ip`:

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain("192.168.2.1");

console.log(parseResult.type === ParseResultType.Ip); // true
console.log(parseResult.ipVersion); // 4
```

It's debatable if a library for parsing domains should also accept IP addresses. In fact, you could argue that [`parseDomain`](#api-js-parseDomain) should reject an IP address as invalid. While this is true from a technical point of view, we decided to report IP addresses in a special way because we assume that a lot of people are using this library to make sense from an arbitrary hostname (see [#102](https://github.com/peerigon/parse-domain/issues/102)).

### 👉 Reserved domains

There are 5 top-level domains that are not listed in the public suffix list but reserved according to [RFC 6761](https://tools.ietf.org/html/rfc6761) and [RFC 6762](https://tools.ietf.org/html/rfc6762):

- `localhost`
- `local`
- `example`
- `invalid`
- `test`

In these cases, `parseResult.type` will be `ParseResultType.Reserved`:

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain("pecorino.local");

console.log(parseResult.type === ParseResultType.Reserved); // true
console.log(parseResult.labels); // ["pecorino", "local"]
```

### 👉 Domains that are not listed

If the given hostname is valid, but not listed in the downloaded public suffix list, `parseResult.type` will be `ParseResultType.NotListed`:

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain("this.is.not-listed");

console.log(parseResult.type === ParseResultType.NotListed); // true
console.log(parseResult.labels); // ["this", "is", "not-listed"]
```

If a domain is not listed, it can be caused by an outdated list. Make sure to [update the list once in a while](#installation).

⚠️ **Do not treat parseDomain as authoritative answer.** It cannot replace a real DNS lookup to validate if a given domain is known in a certain network.

### 👉 Effective top-level domains

Technically, the term _top-level domain_ describes the very last domain in a hostname (`uk` in `example.co.uk`). Most people, however, use the term _top-level domain_ for the _public suffix_ which is a namespace ["under which Internet users can directly register names"](https://publicsuffix.org/).

Some examples for public suffixes:

- `com` in `example.com`
- `co.uk` in `example.co.uk`
- `co` in `example.co`
- but also `com.co` in `example.com.co`

If the hostname is listed in the public suffix list, the `parseResult.type` will be `ParseResultType.Listed`:

```javascript
import { parseDomain, ParseResultType } from "parse-domain";

const parseResult = parseDomain("example.co.uk");

console.log(parseResult.type === ParseResultType.Listed); // true
console.log(parseResult.labels); // ["example", "co", "uk"]
```

Now `parseResult` will also provide a `subDomains`, `domain` and `topLevelDomains` property:

```javascript
const { subDomains, domain, topLevelDomains } = parseResult;

console.log(subDomains); // []
console.log(domain); // "example"
console.log(topLevelDomains); // ["co", "uk"]
```

### 👉 Switch over `parseResult.type` to distinguish between different parse results

We recommend switching over the `parseResult.type`:

```javascript
switch (parseResult.type) {
  case ParseResultType.Listed: {
    const { hostname, topLevelDomains } = parseResult;

    console.log(`${hostname} belongs to ${topLevelDomains.join(".")}`);
    break;
  }
  case ParseResultType.Reserved:
  case ParseResultType.NotListed: {
    const { hostname } = parseResult;

    console.log(`${hostname} is a reserved or unknown domain`);
    break;
  }
  default:
    throw new Error(`${hostname} is an ip address or invalid domain`);
}
```

### ⚠️ Effective TLDs !== TLDs acknowledged by ICANN

What's surprising to a lot of people is that the definition of public suffix means that regular user domains can become effective top-level domains:

```javascript
const { subDomains, domain, topLevelDomains } = parseDomain(
  "parse-domain.github.io",
);

console.log(subDomains); // []
console.log(domain); // "parse-domain"
console.log(topLevelDomains); // ["github", "io"] 🤯
```

In this case, `github.io` is nothing else than a private domain name registrar. `github.io` is the _effective_ top-level domain and browsers are treating it like that (e.g. for setting [`document.domain`](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)).

If you want to deviate from the browser's understanding of a top-level domain and you're only interested in top-level domains acknowledged by [ICANN](https://en.wikipedia.org/wiki/ICANN), there's an `icann` property:

```javascript
const parseResult = parseDomain("parse-domain.github.io");
const { subDomains, domain, topLevelDomains } = parseResult.icann;

console.log(subDomains); // ["parse-domain"]
console.log(domain); // "github"
console.log(topLevelDomains); // ["io"]
```

### ⚠️ `domain` can also be `undefined`

```javascript
const { subDomains, domain, topLevelDomains } = parseDomain("co.uk");

console.log(subDomains); // []
console.log(domain); // undefined
console.log(topLevelDomains); // ["co", "uk"]
```

### ⚠️ `""` is a valid (but reserved) domain

The empty string `""` represents the [DNS root](https://en.wikipedia.org/wiki/DNS_root_zone) and is considered to be valid. `parseResult.type` will be `ParseResultType.Reserved` in that case:

```javascript
const { type, subDomains, domain, topLevelDomains } = parseDomain("");

console.log(type === ParseResultType.Reserved); // true
console.log(subDomains); // []
console.log(domain); // undefined
console.log(topLevelDomains); // []
```

## API

🧩 = JavaScript export<br>
🧬 = TypeScript export

<h3 id="api-js-parseDomain">
🧩 <code>export parseDomain(hostname: string | typeof <a href="#api-js-NO_HOSTNAME">NO_HOSTNAME</a>, options?: <a href="#api-ts-ParseDomainOptions">ParseDomainOptions</a>): <a href="#api-ts-ParseResult">ParseResult</a></code>
</h3>

Takes a hostname (e.g. `"www.example.com"`) and returns a [`ParseResult`](#api-ts-ParseResult). The hostname must only contain basic latin letters, digits, hyphens and dots. International hostnames must be puny-encoded. Does not throw an error, even with invalid input.

```javascript
import { parseDomain } from "parse-domain";

const parseResult = parseDomain("www.example.com");
```

Use `Validation.Lax` if you want to allow all characters:

```javascript
import { parseDomain, Validation } from "parse-domain";

const parseResult = parseDomain("_jabber._tcp.gmail.com", {
  validation: Validation.Lax,
});
```

<h3 id="api-js-fromUrl">
🧩 <code>export fromUrl(input: string): string | typeof <a href="#api-js-NO_HOSTNAME">NO_HOSTNAME</a></code>
</h3>

Takes a URL-like string and tries to extract the hostname. Requires the global [`URL` constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL) to be available on the platform. Returns the [`NO_HOSTNAME`](#api-js-NO_HOSTNAME) symbol if the input was not a string or the hostname could not be extracted. Take a look [at the test suite](/src/from-url.test.ts) for some examples. Does not throw an error, even with invalid input.

<h3 id="api-js-NO_HOSTNAME">
🧩 <code>export NO_HOSTNAME: unique symbol</code>
</h3>

`NO_HOSTNAME` is a symbol that is returned by [`fromUrl`](#api-js-fromUrl) when it was not able to extract a hostname from the given string. When passed to [`parseDomain`](#api-js-parseDomain), it will always yield a [`ParseResultInvalid`](#api-ts-ParseResultInvalid).

<h3 id="api-ts-ParseDomainOptions">
🧬 <code>export type ParseDomainOptions</code>
</h3>

```ts
export type ParseDomainOptions = {
  /**
   * If no validation is specified, Validation.Strict will be used.
   **/
  validation?: Validation;
};
```

<h3 id="api-js-Validation">
🧩 <code>export Validation</code>
</h3>

An object that holds all possible [Validation](#api-ts-Validation) `validation` values:

```javascript
export const Validation = {
  /**
   * Allows any octets as labels
   * but still restricts the length of labels and the overall domain.
   *
   * @see https://www.rfc-editor.org/rfc/rfc2181#section-11
   **/
  Lax: "LAX",

  /**
   * Only allows ASCII letters, digits and hyphens (aka LDH),
   * forbids hyphens at the beginning or end of a label
   * and requires top-level domain names not to be all-numeric.
   *
   * This is the default if no validation is configured.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc3696#section-2
   */
  Strict: "STRICT",
};
```

<h3 id="api-ts-Validation">
🧬 <code>export Validation</code>
</h3>

This type represents all possible `validation` values.

<h3 id="api-ts-ParseResult">
🧬 <code>export ParseResult</code>
</h3>

A `ParseResult` is either a [`ParseResultInvalid`](#api-ts-ParseResultInvalid), [`ParseResultIp`](#api-ts-ParseResultIp), [`ParseResultReserved`](#api-ts-ParseResultReserved), [`ParseResultNotListed`](#api-ts-ParseResultNotListed) or [`ParseResultListed`](#api-ts-ParseResultListed).

All parse results have a `type` property that is either `"INVALID"`, `"IP"`,`"RESERVED"`,`"NOT_LISTED"`or`"LISTED"`. Use the exported [ParseResultType](#api-js-ParseResultType) to check for the type instead of checking against string literals.

All parse results also have a `hostname` property that provides access to the sanitized hostname that was passed to [`parseDomain`](#api-js-parseDomain).

<h3 id="api-js-ParseResultType">
🧩 <code>export ParseResultType</code>
</h3>

An object that holds all possible [ParseResult](#api-ts-ParseResult) `type` values:

```javascript
const ParseResultType = {
  Invalid: "INVALID",
  Ip: "IP",
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
- A domain label contains a character that is not a basic latin character, digit or hyphen

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
  LastLabelInvalid: "LAST_LABEL_INVALID",
};
```

<h3 id="api-ts-ValidationErrorType">
🧬 <code>export ValidationErrorType</code>
</h3>

This type represents all possible `type` values of a [ValidationError](#api-ts-ValidationError).

<h3 id="api-ts-ParseResultIp">
🧬 <code>export ParseResultIp</code>
</h3>

This type describes the shape of the parse result that is returned when the given hostname was an IPv4 or IPv6 address.

```ts
type ParseResultIp = {
  type: ParseResultType.Ip;
  hostname: string;
  ipVersion: 4 | 6;
};

// Example

{
  type: "IP",
  hostname: "192.168.0.1",
  ipVersion: 4
}
```

According to [RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.2.2), IPv6 addresses need to be surrounded by `[` and `]` in URLs. [`parseDomain`](#api-js-parseDomain) accepts both IPv6 address with and without square brackets:

```js
// Recognized as IPv4 address
parseDomain("192.168.0.1");
// Both are recognized as proper IPv6 addresses
parseDomain("::");
parseDomain("[::]");
```

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
  labels: Array<string>;
};

// Example

{
  type: "RESERVED",
  hostname: "pecorino.local",
  labels: ["pecorino", "local"]
}
```

⚠️ Reserved IPs, such as `127.0.0.1`, will not be reported as reserved, but as <a href="#-export-parseresultip">`ParseResultIp`</a>. See [#117](https://github.com/peerigon/parse-domain/issues/117).

<h3 id="api-ts-ParseResultNotListed">
🧬 <code>export ParseResultNotListed</code>
</h3>

Describes the shape of the parse result that is returned when the given hostname is valid and does not belong to a reserved top-level domain, but is not listed in the downloaded public suffix list.

```ts
type ParseResultNotListed = {
  type: ParseResultType.NotListed;
  hostname: string;
  labels: Array<string>;
};

// Example

{
  type: "NOT_LISTED",
  hostname: "this.is.not-listed",
  labels: ["this", "is", "not-listed"]
}
```

<h3 id="api-ts-ParseResultListed">
🧬 <code>export ParseResultListed</code>
</h3>

Describes the shape of the parse result that is returned when the given hostname belongs to a top-level domain that is listed in the public suffix list.

```ts
type ParseResultListed = {
  type: ParseResultType.Listed;
  hostname: string;
  labels: Array<string>;
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
  labels: ["parse-domain", "github", "io"]
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

MIT

## Sponsors

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com)
