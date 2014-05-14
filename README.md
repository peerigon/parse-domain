parse-domain
========================================================================
**Splits an url into sub-domain, domain and top-level-domain.**

Since domains are handled differently across different countries and organizations, splitting an url into sub-domain, domain and top-level-domain is not a simple regexp. **parse-domain** uses a [large list of known tlds](https://github.com/peerigon/parse-domain/blob/master/lib/build/tld.txt) (borrowed from [http://publicsuffix.org](http://publicsuffix.org/list/effective_tld_names.dat)) to recognize different parts of the domain.

```javascript
var parseDomain = require("parse-domain");

expect(parseDomain("some.subdomain.example.co.uk")).to.eql({
    subdomain: "some.subdomain",
    domain: "example",
    tld: "co.uk"
});

expect(parseDomain("https://user:password@example.co.uk:8080/some/path?and&query#hash")).to.eql({
    subdomain: "",
    domain: "example",
    tld: "co.uk"
});

expect(parseDomain("unknown.tld.kk")).to.equal(null);
expect(parseDomain("invalid url")).to.equal(null);
expect(parseDomain({})).to.equal(null);
```

<br />

Setup
------------------------------------------------------------------------

[![npm status](https://nodei.co/npm/parse-domain.png?downloads=true&stars=true)](https://npmjs.org/package/parse-domain)

[![build status](https://travis-ci.org/peerigon/parse-domain.png)](http://travis-ci.org/peerigon/parse-domain)
[![dependencies](https://david-dm.org/peerigon/parse-domain.png)](http://david-dm.org/peerigon/parse-domain)
[![devDependencies](https://david-dm.org/peerigon/parse-domain/dev-status.png)](http://david-dm.org/peerigon/parse-domain#info=devDependencies)

[![browser support](https://ci.testling.com/peerigon/parse-domain.png)
](https://ci.testling.com/peerigon/parse-domain)

<br />

API
------------------------------------------------------------------------

### parseDomain(url: String): ParsedDomain|null

Returns `null` if `url` has an unknown tld or if it's not a valid url.

### ParsedDomain

```
{
    tld: String,
    domain: String,
    subdomain: String
}
```

<br />

License
------------------------------------------------------------------------

MIT
