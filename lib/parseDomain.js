"use strict";

var protocol = /^https?:\/\//,
    port = /:\d{2,5}$/,
    path = /\/.*$/,
    tld = require("./tld.js"),
    separator = /\.|@/g;

/**
 * Removes the protocol, sub-domain and path of the given url.
 *
 * For example:
 * "http://www.google.de/some/path?q=something"  ==>  "google.de"
 *
 * Since the top-level domain is handled differently by every country, this function only
 * supports a defined set of top-level domains like .de, .com and .co.uk. If the given url
 * contains an unsupported top-level domain this function returns an empty string.
 *
 * @param {string} url
 * @returns {string}
 */
function parseDomain(url) {
    var tldMatch;

    if (!url || typeof url !== "string") {
        return "";
    }

    url = url.toLowerCase()
        // remove unnecessary parts
        .replace(protocol, "")
        .replace(path, "")
        .replace(port, "");

    // check if tld is supported
    tldMatch = url.match(tld);
    if (tldMatch === null) {
        return "";
    }
    tldMatch = tldMatch[0];

    // remove tld and sub-domains
    url = url.slice(0, -tldMatch.length)
        .split(separator)
        .pop();

    return url + tldMatch;
}

module.exports = parseDomain;