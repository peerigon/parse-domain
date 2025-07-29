import { ipVersion } from "is-ip";
import { NO_HOSTNAME } from "./from-url.js";
import { Label } from "./parse-domain.js";

// See https://en.wikipedia.org/wiki/Domain_name
// See https://tools.ietf.org/html/rfc1034
const LABEL_SEPARATOR = ".";
const LABEL_LENGTH_MIN = 1;
const LABEL_LENGTH_MAX = 63;
/**
 * 255 octets - 2 octets if you remove the last dot
 *
 * @see https://devblogs.microsoft.com/oldnewthing/20120412-00/?p=7873
 */
const DOMAIN_LENGTH_MAX = 253;

const textEncoder = new TextEncoder();

export enum Validation {
  /**
   * Allows any octets as labels but still restricts the length of labels and
   * the overall domain.
   *
   * @see https://www.rfc-editor.org/rfc/rfc2181#section-11
   */
  Lax = "LAX",

  /**
   * Only allows ASCII letters, digits and hyphens (aka LDH), forbids hyphens at
   * the beginning or end of a label and requires top-level domain names not to
   * be all-numeric.
   *
   * This is the default if no validation is configured.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc3696#section-2
   */
  Strict = "STRICT",
}

export enum ValidationErrorType {
  NoHostname = "NO_HOSTNAME",
  DomainMaxLength = "DOMAIN_MAX_LENGTH",
  LabelMinLength = "LABEL_MIN_LENGTH",
  LabelMaxLength = "LABEL_MAX_LENGTH",
  LabelInvalidCharacter = "LABEL_INVALID_CHARACTER",
  LastLabelInvalid = "LAST_LABEL_INVALID",
}

export type ValidationError = {
  type: ValidationErrorType;
  message: string;
  column: number;
};

export enum SanitizationResultType {
  ValidIp = "VALID_IP",
  ValidDomain = "VALID_DOMAIN",
  Error = "ERROR",
}

export type SanitizationResultValidIp = {
  type: SanitizationResultType.ValidIp;
  ip: string;
  ipVersion: Exclude<ReturnType<typeof ipVersion>, undefined>;
};

export type SanitizationResultValidDomain = {
  type: SanitizationResultType.ValidDomain;
  domain: string;
  labels: Array<Label>;
};

export type SanitizationResultError = {
  type: SanitizationResultType.Error;
  errors: Array<ValidationError>;
};

export type SanitizationResult =
  | SanitizationResultValidIp
  | SanitizationResultValidDomain
  | SanitizationResultError;

const createNoHostnameError = (input: unknown) => {
  return {
    type: ValidationErrorType.NoHostname,
    message: `The given input ${String(input)} does not look like a hostname.`,
    column: 1,
  };
};

const createDomainMaxLengthError = (domain: string, length: number) => {
  return {
    type: ValidationErrorType.DomainMaxLength,
    message: `Domain "${domain}" is too long. Domain is ${length} octets long but should not be longer than ${DOMAIN_LENGTH_MAX}.`,
    column: length,
  };
};

const createLabelMinLengthError = (label: string, column: number) => {
  const length = label.length;

  return {
    type: ValidationErrorType.LabelMinLength,
    message: `Label "${label}" is too short. Label is ${length} octets long but should be at least ${LABEL_LENGTH_MIN}.`,
    column,
  };
};

const createLabelMaxLengthError = (label: string, column: number) => {
  const length = label.length;

  return {
    type: ValidationErrorType.LabelMaxLength,
    message: `Label "${label}" is too long. Label is ${length} octets long but should not be longer than ${LABEL_LENGTH_MAX}.`,
    column,
  };
};

const createLabelInvalidCharacterError = (
  label: string,
  invalidCharacter: string,
  column: number,
) => {
  return {
    type: ValidationErrorType.LabelInvalidCharacter,
    message: `Label "${label}" contains invalid character "${invalidCharacter}" at column ${column}.`,
    column,
  };
};

const createLastLabelInvalidError = (label: string, column: number) => {
  return {
    type: ValidationErrorType.LabelInvalidCharacter,
    message: `Last label "${label}" must not be all-numeric.`,
    column,
  };
};

export const sanitize = (
  input: string | typeof NO_HOSTNAME,
  options: { validation?: Validation } = {},
): SanitizationResult => {
  // Extra check for non-TypeScript users
  if (typeof input !== "string") {
    return {
      type: SanitizationResultType.Error,
      errors: [createNoHostnameError(input)],
    };
  }

  if (input === "") {
    return {
      type: SanitizationResultType.ValidDomain,
      domain: input,
      labels: [],
    };
  }

  // IPv6 addresses are surrounded by square brackets in URLs
  // See https://tools.ietf.org/html/rfc3986#section-3.2.2
  const inputTrimmedAsIp = input.replace(/^\[|]$/g, "");
  const ipVersionOfInput = ipVersion(inputTrimmedAsIp);

  if (ipVersionOfInput !== undefined) {
    return {
      type: SanitizationResultType.ValidIp,
      ip: inputTrimmedAsIp,
      ipVersion: ipVersionOfInput,
    };
  }

  const lastChar = input.charAt(input.length - 1);
  const canonicalInput =
    lastChar === LABEL_SEPARATOR ? input.slice(0, -1) : input;
  const octets = new TextEncoder().encode(canonicalInput);

  if (octets.length > DOMAIN_LENGTH_MAX) {
    return {
      type: SanitizationResultType.Error,
      errors: [createDomainMaxLengthError(input, octets.length)],
    };
  }

  const labels = canonicalInput.split(LABEL_SEPARATOR);

  const { validation = Validation.Strict } = options;
  const labelValidationErrors = validateLabels[validation](labels);

  if (labelValidationErrors.length > 0) {
    return {
      type: SanitizationResultType.Error,
      errors: labelValidationErrors,
    };
  }

  return {
    type: SanitizationResultType.ValidDomain,
    domain: input,
    labels,
  };
};

const validateLabels = {
  [Validation.Lax]: (labels: Array<string>) => {
    const labelValidationErrors = [];
    let column = 1;

    for (const label of labels) {
      const octets = textEncoder.encode(label);

      if (octets.length < LABEL_LENGTH_MIN) {
        labelValidationErrors.push(createLabelMinLengthError(label, column));
      } else if (octets.length > LABEL_LENGTH_MAX) {
        labelValidationErrors.push(createLabelMaxLengthError(label, column));
      }
      column += label.length + LABEL_SEPARATOR.length;
    }

    return labelValidationErrors;
  },
  [Validation.Strict]: (labels: Array<string>) => {
    const labelValidationErrors = [];
    let column = 1;
    let lastLabel;

    for (const label of labels) {
      // According to https://tools.ietf.org/html/rfc6761 labels should
      // only contain ASCII letters, digits and hyphens (LDH).
      const invalidCharacter = /[^\da-z-]/i.exec(label);

      if (invalidCharacter) {
        labelValidationErrors.push(
          createLabelInvalidCharacterError(
            label,
            invalidCharacter[0],
            invalidCharacter.index + 1,
          ),
        );
      }
      if (label.startsWith("-")) {
        labelValidationErrors.push(
          createLabelInvalidCharacterError(label, "-", column),
        );
      } else if (label.endsWith("-")) {
        labelValidationErrors.push(
          createLabelInvalidCharacterError(
            label,
            "-",
            column + label.length - 1,
          ),
        );
      }
      if (
        // We can use .length here to check for the octet size because
        // label can only contain ASCII LDH characters at this point.
        label.length < LABEL_LENGTH_MIN
      ) {
        labelValidationErrors.push(createLabelMinLengthError(label, column));
      } else if (label.length > LABEL_LENGTH_MAX) {
        labelValidationErrors.push(createLabelMaxLengthError(label, column));
      }

      column += label.length + LABEL_SEPARATOR.length;
      lastLabel = label;
    }

    if (lastLabel !== undefined && /[a-z-]/iu.test(lastLabel) === false) {
      labelValidationErrors.push(
        createLastLabelInvalidError(
          lastLabel,
          column - lastLabel.length - LABEL_SEPARATOR.length,
        ),
      );
    }

    return labelValidationErrors;
  },
};
