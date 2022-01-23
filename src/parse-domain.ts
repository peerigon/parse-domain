import { icannTrie, privateTrie } from "./serialized-tries.js";
import { lookUpTldsInTrie } from "./trie/look-up.js";
import {
  ValidationError,
  sanitize,
  SanitizationResultType,
  SanitizationResultValidIp,
  Validation,
} from "./sanitize.js";
import { TrieRootNode } from "./trie/nodes.js";
import { parseTrie } from "./trie/parse-trie.js";
import { NO_HOSTNAME } from "./from-url.js";

export const RESERVED_TOP_LEVEL_DOMAINS = [
  "localhost",
  "local",
  "example",
  "invalid",
  "test",
];

export type Label = string;

export enum ParseResultType {
  /**
   * This parse result is returned in case the given hostname does not adhere to [RFC 1034](https://tools.ietf.org/html/rfc1034).
   */
  Invalid = "INVALID",
  /**
   * This parse result is returned if the given hostname was an IPv4 or IPv6.
   */
  Ip = "IP",
  /**
   * This parse result is returned when the given hostname
   * - is the root domain (the empty string `""`)
   * - belongs to the top-level domain `localhost`, `local`, `example`, `invalid` or `test`
   */
  Reserved = "RESERVED",
  /**
   * This parse result is returned when the given hostname is valid and does not belong to a reserved top-level domain, but is not listed in the public suffix list.
   */
  NotListed = "NOT_LISTED",
  /**
   * This parse result is returned when the given hostname belongs to a top-level domain that is listed in the public suffix list.
   */
  Listed = "LISTED",
}

// The following parse result types are organized in this complicated way
// way because every property should only be described by a single JSDoc comment.
// If we copy the types (hence duplicating the shared properties),
// JSDoc comments would show up duplicated in the final return type as well.
type ParseResultCommon<Type extends ParseResultType> = {
  /**
   * The type of the parse result. Use switch or if to distinguish between different results.
   */
  type: Type;
  /**
   * The original hostname that was passed to parseDomain().
   */
  hostname: Type extends ParseResultType.Invalid
    ? string | typeof NO_HOSTNAME
    : string;
};

export type ParseResultInvalid = ParseResultCommon<ParseResultType.Invalid> & {
  /**
   * An array of validation errors.
   */
  errors: Array<ValidationError>;
};

type ParseResultCommonValidDomain = {
  /**
   * An array of labels that were separated by a dot character in the given hostname.
   */
  labels: Array<Label>;
};

export type ParseResultIp = ParseResultCommon<ParseResultType.Ip> &
  Pick<SanitizationResultValidIp, "ipVersion">;

export type ParseResultReserved = ParseResultCommon<ParseResultType.Reserved> &
  ParseResultCommonValidDomain;

export type ParseResultNotListed =
  ParseResultCommon<ParseResultType.NotListed> & ParseResultCommonValidDomain;

type ParseResultListedDomains = {
  /**
   * An array of labels that belong to the subdomain. Can be empty if there was no subdomain in the given hostname.
   */
  subDomains: Array<Label>;
  /**
   * The first label that belongs to the user-controlled section of the hostname. Can be undefined if just a top-level domain was passed to parseDomain().
   */
  domain: Label | undefined;
  /**
   * An array of labels that are controlled by the domain registrar.
   */
  topLevelDomains: Array<Label>;
};

export type ParseResultListed = ParseResultCommon<ParseResultType.Listed> &
  ParseResultCommonValidDomain &
  ParseResultListedDomains & {
    /**
     * The parse result according to ICANN only without private top-level domains.
     */
    icann: ParseResultListedDomains;
  };

export type ParseResult =
  | ParseResultInvalid
  | ParseResultIp
  | ParseResultReserved
  | ParseResultNotListed
  | ParseResultListed;

const getAtIndex = <Item>(
  array: Array<Item>,
  index: number
): Item | undefined => {
  return index >= 0 && index < array.length ? array[index] : undefined;
};

const splitLabelsIntoDomains = (
  labels: Array<Label>,
  index: number
): ParseResultListedDomains => {
  return {
    subDomains: labels.slice(0, Math.max(0, index)),
    domain: getAtIndex(labels, index),
    topLevelDomains: labels.slice(index + 1),
  };
};

let parsedIcannTrie: TrieRootNode | undefined;
let parsedPrivateTrie: TrieRootNode | undefined;

export type ParseDomainOptions = {
  /**
   * If no validation is specified, Validation.Strict will be used.
   **/
  validation?: Validation;
};

/**
 * Splits the given hostname in topLevelDomains, a domain and subDomains.
 */
export const parseDomain = (
  hostname: string | typeof NO_HOSTNAME,
  options?: ParseDomainOptions
): ParseResult => {
  const sanitizationResult = sanitize(hostname, options);

  if (sanitizationResult.type === SanitizationResultType.Error) {
    return {
      type: ParseResultType.Invalid,
      hostname,
      errors: sanitizationResult.errors,
    };
  }

  if (sanitizationResult.type === SanitizationResultType.ValidIp) {
    return {
      type: ParseResultType.Ip,
      hostname: sanitizationResult.ip,
      ipVersion: sanitizationResult.ipVersion,
    };
  }

  const { labels, domain } = sanitizationResult;

  if (
    hostname === "" ||
    RESERVED_TOP_LEVEL_DOMAINS.includes(labels[labels.length - 1])
  ) {
    return {
      type: ParseResultType.Reserved,
      hostname: domain,
      labels,
    };
  }

  // Parse the serialized trie lazily
  parsedIcannTrie = parsedIcannTrie ?? parseTrie(icannTrie);
  parsedPrivateTrie = parsedPrivateTrie ?? parseTrie(privateTrie);

  const icannTlds = lookUpTldsInTrie(labels, parsedIcannTrie);
  const privateTlds = lookUpTldsInTrie(labels, parsedPrivateTrie);

  if (icannTlds.length === 0 && privateTlds.length === 0) {
    return {
      type: ParseResultType.NotListed,
      hostname: domain,
      labels,
    };
  }

  const indexOfPublicSuffixDomain =
    labels.length - Math.max(privateTlds.length, icannTlds.length) - 1;

  const indexOfIcannDomain = labels.length - icannTlds.length - 1;

  return {
    type: ParseResultType.Listed,
    hostname: domain,
    labels,
    icann: splitLabelsIntoDomains(labels, indexOfIcannDomain),
    ...splitLabelsIntoDomains(labels, indexOfPublicSuffixDomain),
  };
};
