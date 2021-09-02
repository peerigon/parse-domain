import isIp from "is-ip";
import {Label} from "./parse-domain";
import {NO_HOSTNAME} from "./from-url";

// See https://en.wikipedia.org/wiki/Domain_name
// See https://tools.ietf.org/html/rfc1034
const LABEL_SEPARATOR = ".";
const LABEL_ROOT = "";
const LABEL_LENGTH_MIN = 1;
const LABEL_LENGTH_MAX = 63;
const DOMAIN_LENGTH_MAX = 253;

export enum ValidationErrorType {
	NoHostname = "NO_HOSTNAME",
	DomainMaxLength = "DOMAIN_MAX_LENGTH",
	LabelMinLength = "LABEL_MIN_LENGTH",
	LabelMaxLength = "LABEL_MAX_LENGTH",
	LabelInvalidCharacter = "LABEL_INVALID_CHARACTER",
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
	ipVersion: Exclude<ReturnType<typeof isIp.version>, undefined>;
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

const createDomainMaxLengthError = (domain: string) => {
	const length = domain.length;

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

export const sanitize = (
	input: string | typeof NO_HOSTNAME,
): SanitizationResult => {
	// Extra check for non-TypeScript users
	if (typeof input !== "string") {
		return {
			type: SanitizationResultType.Error,
			errors: [createNoHostnameError(input)],
		};
	}

	const inputTrimmed = input.trim();
	// IPv6 addresses are surrounded by square brackets in URLs
	// See https://tools.ietf.org/html/rfc3986#section-3.2.2
	const inputTrimmedAsIp = inputTrimmed.replace(/^\[|]$/g, "");
	const ipVersion = isIp.version(inputTrimmedAsIp);

	if (ipVersion !== undefined) {
		return {
			type: SanitizationResultType.ValidIp,
			ip: inputTrimmedAsIp,
			ipVersion,
		};
	}

	if (inputTrimmed.length > DOMAIN_LENGTH_MAX) {
		return {
			type: SanitizationResultType.Error,
			errors: [createDomainMaxLengthError(inputTrimmed)],
		};
	}

	const labels = inputTrimmed.split(LABEL_SEPARATOR);
	const lastLabel = labels[labels.length - 1];

	// If the last label is the special root label, ignore it
	if (lastLabel === LABEL_ROOT) {
		labels.pop();
	}

	const labelValidationErrors = [];
	let column = 1;

	for (const label of labels) {
		// According to https://tools.ietf.org/html/rfc6761 labels should
		// only contain ASCII letters, digits and hyphens (LDH).
		const invalidCharacter = /[^\da-z-]/iu.exec(label);

		if (invalidCharacter) {
			labelValidationErrors.push(
				createLabelInvalidCharacterError(
					label,
					invalidCharacter[0],
					invalidCharacter.index + 1,
				),
			);
		} else if (
			// We can use .length here to check for the octet size because
			// label can only contain ASCII LDH characters at this point.
			label.length < LABEL_LENGTH_MIN
		) {
			labelValidationErrors.push(createLabelMinLengthError(label, column));
		} else if (label.length > LABEL_LENGTH_MAX) {
			labelValidationErrors.push(createLabelMaxLengthError(label, column));
		}

		column += label.length + LABEL_SEPARATOR.length;
	}

	if (labelValidationErrors.length > 0) {
		return {
			type: SanitizationResultType.Error,
			errors: labelValidationErrors,
		};
	}

	return {
		type: SanitizationResultType.ValidDomain,
		domain: inputTrimmed,
		labels,
	};
};
