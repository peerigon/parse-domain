"use strict";

function normalizeUrl(url) {
    if (!url || typeof url !== "string") {
        return null;
    }

    return url.trim().toLowerCase();
}

function normalizeOptions(options) {
    const normalized = !options || typeof options !== "object" ? Object.create(null) : options;

    if ("privateTlds" in normalized === false) {
        normalized.privateTlds = false;
    }
    if ("customTlds" in normalized && normalized.customTlds instanceof RegExp === false) {
        normalized.customTlds = new RegExp("\\.(" + normalized.customTlds.join("|") + ")$");
    }

    return normalized;
}

exports.url = normalizeUrl;
exports.options = normalizeOptions;