"use strict";

var urlParts = /^(https?:\/\/)?(.+@)?(.+?)(:\d{2,5})?([/?].*)?$/,// 1 = protocol, 2 = auth, 3 = domain, 4 = port, 5 = path
    knownTlds = require("./tld.js"),
    dot = /\./g;

/**
 * Removes all unnecessary parts of the domain (e.g. protocol, auth, port, path, query) and parses the remaining domain.
 *
 * For example:
 *
 * parseDomain("http://www.google.com:1234/some/path?q=something")
 *
 * yields to
 *
 * {
 *     subdomain: "www",
 *     domain: "google"
 *     tld: "com"
 * }
 *
 * Since the top-level domain is handled differently by every country, this function only
 * supports all tlds listed in lib/build/tld.txt
 *
 * If the given url is not valid or isn't supported by the tld.txt, this function returns null.
 *
 * @param {String}   url
 * @param {Object}   [options]
 * @param {String[]|RegExp} [options.customTlds]
 * @returns {Object|null}
 */
function parseDomain(url, options) {
    var urlSplit,
        tld,
        domain,
        subdomain;

    if (!url || typeof url !== "string") {
        return null;
    }

    if (!options || typeof options !== "object") {
        options = Object.create(null);
    }

    // urlSplit can't be null because urlParts will always match at the third capture
    urlSplit = url.toLowerCase().match(urlParts);
    domain = urlSplit[3]; // domain will now be something like sub.domain.example.com

    // check if tld is supported
    tld = domain.match(knownTlds);

    // for potentially unrecognized tlds, try matching against custom tlds
    if (tld === null && options.customTlds) {
        if (options.customTlds instanceof RegExp === false) {
            // build regexp from options.customTlds
            options.customTlds = new RegExp("\\.(" + options.customTlds.join("|") + ")$");
        }
        // try matching against a built regexp of custom tlds
        tld = domain.match(options.customTlds);
    }

    if (tld === null) {
        return null;
    }
    tld = tld[0];

    // remove tld and split by dot
    urlSplit = domain.slice(0, -tld.length).split(dot);

    if (tld.charAt(0) === ".") {
        // removes the remaining dot, if present (added to handle localhost)
        tld = tld.slice(1);
    }
    domain = urlSplit.pop();
    subdomain = urlSplit.join(".");

    return {
        tld: tld,
        domain: domain,
        subdomain: subdomain
    };
}

module.exports = parseDomain;
