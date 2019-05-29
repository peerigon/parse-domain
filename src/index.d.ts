export as namespace parseDomain;

declare namespace parseDomain {
    interface ParseOptions {
        customTlds?: RegExp | Array<string>;
        privateTlds?: boolean;
    }

    interface ParsedDomain {
        domain: string;
        subdomain: string;
        tld: string;
    }
}

declare function parseDomain(url: string, options?: parseDomain.ParseOptions): parseDomain.ParsedDomain | null;

export = parseDomain;
