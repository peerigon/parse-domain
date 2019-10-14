"use strict";

const URL = require("url");
const icannTrie = require("../lists/icann.complete");
const privateTrie = require("../lists/private.complete");
const normalize = require("./normalize.js");
const lookUp = require("./trie/lookUp");

// eslint-disable-next-line
const dot = /\./g;
const emptyArr = [];

function matchTld(hostname, options) {
    // for potentially unrecognized tlds, try matching against custom tlds
    if (options.customTlds) {
        // try matching against a built regexp of custom tlds
        const tld = hostname.match(options.customTlds);

        if (tld !== null) {
            return tld[0];
        }
    }
    const domains = hostname.split(".");
    const icannTlds = lookUp(icannTrie, domains);
    const privateTlds = options.privateTlds ? lookUp(privateTrie, domains) : emptyArr;

    if (privateTlds.length > icannTlds.length) {
        return "." + privateTlds.join(".");
    }
    if (icannTlds.length > 0) {
        return "." + icannTlds.join(".");
    }

    return null;
}

/* eslint-disable jsdoc/no-undefined-types */
/**
 * Removes all unnecessary parts of the domain (e.g. protocol, auth, port, path, query)
 * and parses the remaining domain. The returned object contains the properties 'subdomain', 'domain' and 'tld'.
 *
 * Since the top-level domain is handled differently by every country, this function only
 * supports all tlds listed in src/build/tld.txt.
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
    const normalizedUrl = normalize.url(url);
    let tld = null;

    if (!normalizedUrl) {
        return null;
    }

    const normalizedOptions = normalize.options(options);
    const {hostname} = new URL.URL(url);

    tld = matchTld(hostname, normalizedOptions);

    if (tld === null) {
        return null;
    }

    // remove tld and split by dot
    const hostWithoutTld = hostname.slice(0, -tld.length).split(dot);

    if (tld.charAt(0) === ".") {
        // removes the remaining dot, if present (added to handle localhost)
        tld = tld.slice(1);
    }

    const hostWithoutTldOrDomain = hostWithoutTld.pop();
    const subdomain = hostWithoutTld.join(".");

    return {
        tld,
        domain: hostWithoutTldOrDomain,
        subdomain,
    };
}

module.exports = parseDomain;
