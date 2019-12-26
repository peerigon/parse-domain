import {Labels} from "./parse-domain";

// See https://en.wikipedia.org/wiki/Domain_name
// See https://tools.ietf.org/html/rfc6761

const LABEL_SEPARATOR = ".";
const LABEL_ROOT = "";
const LABEL_LENGTH_MIN = 1;
const LABEL_LENGTH_MAX = 63;
const DOMAIN_LENGTH_MAX = 253;

export enum ValidationErrorType {
	LabelMinLength,
	LabelMaxLength,
	DomainMaxLength,
}

export type ValidationError = {
	type: ValidationErrorType;
	message: string;
	column: number;
};

export enum SanitizationResultType {
	Ok,
	Error,
}

export type SanitizationResultOk = {
	type: SanitizationResultType.Ok;
	originalInput: string;
	labels: Labels;
};

export type SanitizationResultError = {
	type: SanitizationResultType.Error;
	originalInput: string;
	errors: Array<ValidationError>;
};

export type SanitizationResult = SanitizationResultOk | SanitizationResultError;

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

export const sanitize = (domain: string): SanitizationResult => {
	if (domain.length > DOMAIN_LENGTH_MAX) {
		return {
			type: SanitizationResultType.Error,
			originalInput: domain,
			errors: [createDomainMaxLengthError(domain)],
		};
	}

	const labels = domain.split(LABEL_SEPARATOR);
	const lastLabel = labels[labels.length - 1];

	// If the last label is the special root label, ignore it
	if (lastLabel === LABEL_ROOT) {
		labels.pop();
	}

	const labelValidationErrors = [];
	let column = 1;

	for (const label of labels) {
		if (label.length < LABEL_LENGTH_MIN) {
			labelValidationErrors.push(createLabelMinLengthError(label, column));
		} else if (label.length > LABEL_LENGTH_MAX) {
			labelValidationErrors.push(createLabelMaxLengthError(label, column));
		}

		column += label.length + LABEL_SEPARATOR.length;
	}

	if (labelValidationErrors.length > 0) {
		return {
			type: SanitizationResultType.Error,
			originalInput: domain,
			errors: labelValidationErrors,
		};
	}

	return {
		type: SanitizationResultType.Ok,
		originalInput: domain,
		labels,
	};
};
