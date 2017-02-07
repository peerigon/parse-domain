"use strict";

var urlParts = /^(https?:\/\/)?([^/]*@)?(.+?)(:\d{2,5})?([/?].*)?$/; // 1 = protocol, 2 = auth, 3 = domain, 4 = port, 5 = path
var knownTlds = require("./tld.js");
var dot = /\./g;

/**
 * Removes all unnecessary parts of the domain (e.g. protocol, auth, port, path, query)
 * and parses the remaining domain. The returned object contains the properties 'subdomain', 'domain' and 'tld'.
 *
 * Since the top-level domain is handled differently by every country, this function only
 * supports all tlds listed in lib/build/tld.txt.
 *
 * If the given url is not valid or isn't supported by the tld.txt, this function returns null.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {Array<string>|RegExp} [options.customTlds]
 * @param {boolean} [options.privateTlds]
 * @returns {Object|null}
 */
function parseDomain(url, options) {
    var urlSplit;
    var tld = null;
    var domain;
    var subdomain;

    if (!url || typeof url !== "string") {
        return null;
    }

    if (!options || typeof options !== "object") {
        options = Object.create(null);
    }
    if ("privateTlds" in options === false) {
        options.privateTlds = false;
    }

    // urlSplit can't be null because urlParts will always match at the third capture
    urlSplit = url.toLowerCase().match(urlParts);
    domain = urlSplit[3]; // domain will now be something like sub.domain.example.com

    // for potentially unrecognized tlds, try matching against custom tlds
    if (options.customTlds) {
        if (options.customTlds instanceof RegExp === false) {
            // build regexp from options.customTlds
            options.customTlds = new RegExp("\\.(" + options.customTlds.join("|") + ")$");
        }
        // try matching against a built regexp of custom tlds
        tld = domain.match(options.customTlds);
    }

    // If no custom tlds, check if tld is supported
    if (tld === null) {
        tld = domain.match(options.privateTlds ? knownTlds : knownTlds.icann);
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
