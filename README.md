parse-domain
============
**Splits a URL into sub-domain, domain and the effective top-level domain.**

[![](https://img.shields.io/npm/v/parse-domain.svg)](https://www.npmjs.com/package/parse-domain)
[![](https://img.shields.io/npm/dm/parse-domain.svg)](https://www.npmjs.com/package/parse-domain)
[![Dependency Status](https://david-dm.org/peerigon/parse-domain.svg)](https://david-dm.org/peerigon/parse-domain)

Since domains are handled differently across different countries and organizations, splitting a URL into sub-domain, domain and top-level-domain parts is not a simple regexp. **parse-domain** uses a [large list of effective tld names](http://publicsuffix.org/list/effective_tld_names.dat) from publicsuffix.org to recognize different parts of the domain.

Please also read the note on [effective top-level domains](#note-on-effective-top-level-domains).

<br />

Installation
------------------------------------------------------------------------

```sh
npm install --save parse-domain
```

<br />

Usage
------------------------------------------------------------------------

```javascript
// long subdomains can be handled
expect(parseDomain("some.subdomain.example.co.uk")).to.eql({
    subdomain: "some.subdomain",
    domain: "example",
    tld: "co.uk"
});

// usernames, passwords and ports are disregarded
expect(parseDomain("https://user:password@example.co.uk:8080/some/path?and&query#hash")).to.eql({
    subdomain: "",
    domain: "example",
    tld: "co.uk"
});

// non-canonical top-level domains are ignored
expect(parseDomain("unknown.tld.kk")).to.equal(null);

// invalid urls are also ignored
expect(parseDomain("invalid url")).to.equal(null);
expect(parseDomain({})).to.equal(null);
```

### Introducing custom tlds

```javascript
// custom top-level domains can optionally be specified
expect(parseDomain("mymachine.local",{ customTlds: ["local"] })).to.eql({
    subdomain: "",
    domain: "mymachine",
    tld: "local"
});

// custom regexps can optionally be specified (instead of customTlds)
expect(parseDomain("localhost",{ customTlds:/localhost|\.local/ })).to.eql({
    subdomain: "",
    domain: "",
    tld: "localhost"
});
```

It can sometimes be helpful to apply the customTlds argument using a helper function

```javascript
function parseLocalDomains(url) {
    var options = {
        customTlds: /localhost|\.local/
    };
    return parseDomain(url, options);
}

expect(parseLocalDomains("localhost")).to.eql({
    subdomain: "",
    domain: "",
    tld: "localhost"
});
expect(parseLocalDomains("mymachine.local")).to.eql({
    subdomain: "",
    domain: "mymachine",
    tld: "local"
});
```

<br />

API
------------------------------------------------------------------------

### `parseDomain(url: String, options: ParseOptions): ParsedDomain|null`

Returns `null` if `url` has an unknown tld or if it's not a valid url.

#### `ParseOptions`
```javascript
{
    customTlds: RegExp|String[]
}
```

#### `ParsedDomain`
```javascript
{
    tld: String,
    domain: String,
    subdomain: String
}
```

<br />

Note on effective top-level domains
------------------------------------------------------------------------

Technically, the top-level domain is *always* the part after the last dot. That's why publicsuffix.org is a list of *effective* top-level domains: It lists all top-level domains where users are allowed to host any content. That's why `foo.blogspot.com` will be split into

```javascript
{
    tld: "blogspot.com",
    domain: "foo",
    subdomain: ""
}
```

See also [#4](https://github.com/peerigon/parse-domain/issues/4)

<br />

License
------------------------------------------------------------------------

Unlicense
