/* istanbul ignore file */
// Jest will report function coverage errors here otherwise
export { parseDomain, ParseResultType } from "./parse-domain.js";
export type {
  ParseResult,
  ParseResultInvalid,
  ParseResultReserved,
  ParseResultNotListed,
  ParseResultListed,
  ParseResultIp,
} from "./parse-domain.js";
export { fromUrl, NO_HOSTNAME } from "./from-url.js";
export { Validation, ValidationErrorType } from "./sanitize.js";
export type { ValidationError } from "./sanitize.js";
