export as namespace parseDomain;

declare namespace parseDomain {
  interface IParseOptions {
    customTlds?: RegExp | string[];
    privateTlds?: boolean;
  }

  interface IParsedDomain {
    domain?: string;
    subdomain?: string;
    tld?: string;
  }
}

declare function parseDomain (url: string, options?: parseDomain.IParseOptions): parseDomain.IParsedDomain;

export = parseDomain;
