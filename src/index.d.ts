export as namespace parseDomain;

declare namespace parseDomain {
  interface IParsedDomain {
    domain?: string;
    subdomain?: string;
    tld?: string;
  }
}

declare function parseDomain (url: string, customTlds?: RegExp | string[], privateTlds?: boolean): parseDomain.IParsedDomain;

export = parseDomain;
