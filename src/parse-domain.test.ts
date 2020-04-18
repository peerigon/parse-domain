import {parseDomain, ParseResultType} from "./parse-domain";
import {ValidationErrorType} from "./sanitize";
import {fromUrl} from "./from-url";

describe(parseDomain.name, () => {
	test("splits a hostname into subDomains, domain and topLevelDomains", () => {
		expect(parseDomain("www.example.com")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["com"],
		});
		expect(parseDomain("www.example.co.uk")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["co", "uk"],
		});
		expect(parseDomain("www.example.co")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["co"],
		});
		expect(parseDomain("www.example.com.co")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["com", "co"],
		});
	});

	test("recognizes private domains as top-level domains", () => {
		expect(parseDomain("www.example.cloudfront.net")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["cloudfront", "net"],
		});
	});

	test("returns an empty array as subDomains if the hostname has no subDomains", () => {
		expect(parseDomain("example.com")).toMatchObject({
			subDomains: [],
			domain: "example",
			topLevelDomains: ["com"],
		});
		expect(parseDomain("example.co.uk")).toMatchObject({
			subDomains: [],
			domain: "example",
			topLevelDomains: ["co", "uk"],
		});
		expect(parseDomain("example.co")).toMatchObject({
			subDomains: [],
			domain: "example",
			topLevelDomains: ["co"],
		});
		expect(parseDomain("example.com.co")).toMatchObject({
			subDomains: [],
			domain: "example",
			topLevelDomains: ["com", "co"],
		});
	});

	test("returns an empty array as subDomains and undefined as domain if the hostname is a top-level domain", () => {
		expect(parseDomain("com")).toMatchObject({
			subDomains: [],
			domain: undefined,
			topLevelDomains: ["com"],
		});
		expect(parseDomain("co.uk")).toMatchObject({
			subDomains: [],
			domain: undefined,
			topLevelDomains: ["co", "uk"],
		});
		expect(parseDomain("co")).toMatchObject({
			subDomains: [],
			domain: undefined,
			topLevelDomains: ["co"],
		});
		expect(parseDomain("com.co")).toMatchObject({
			subDomains: [],
			domain: undefined,
			topLevelDomains: ["com", "co"],
		});
	});

	test("returns ParseResultType.Listed for all variations of common domains", () => {
		expect(parseDomain("www.example.com")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("example.com")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("com")).toMatchObject({
			type: ParseResultType.Listed,
		});

		expect(parseDomain("www.example.co.uk")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("example.co.uk")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("co.uk")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("uk")).toMatchObject({
			type: ParseResultType.Listed,
		});

		expect(parseDomain("www.example.co")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("example.co")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("co")).toMatchObject({
			type: ParseResultType.Listed,
		});

		expect(parseDomain("www.example.com.co")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("example.com.co")).toMatchObject({
			type: ParseResultType.Listed,
		});
		expect(parseDomain("com.co")).toMatchObject({
			type: ParseResultType.Listed,
		});
	});

	test("returns also a result according to ICANN only", () => {
		expect(parseDomain("www.example.co.uk")).toMatchObject({
			icann: {
				subDomains: ["www"],
				domain: "example",
				topLevelDomains: ["co", "uk"],
			},
		});
		expect(parseDomain("www.example.cloudfront.net")).toMatchObject({
			icann: {
				subDomains: ["www", "example"],
				domain: "cloudfront",
				topLevelDomains: ["net"],
			},
		});
	});

	test("returns type ParseResultType.Reserved for all reserved TLDs according to RFC 6761, 6762", () => {
		expect(parseDomain("example")).toMatchObject({
			type: ParseResultType.Reserved,
		});
		// We decided to treat .invalid domains not in a special way.
		expect(parseDomain("some.invalid")).toMatchObject({
			type: ParseResultType.Reserved,
		});
		expect(parseDomain("some.localhost")).toMatchObject({
			type: ParseResultType.Reserved,
		});
		expect(parseDomain("test")).toMatchObject({
			type: ParseResultType.Reserved,
		});
		expect(parseDomain("www.some.local")).toMatchObject({
			type: ParseResultType.Reserved,
		});
	});

	test("returns an array of domain labels for all reserved TLDs according to RFC 6761, 6762", () => {
		expect(parseDomain("example")).toMatchObject({
			domains: ["example"],
		});
		// We decided to treat .invalid domains not in a special way.
		expect(parseDomain("some.invalid")).toMatchObject({
			domains: ["some", "invalid"],
		});
		expect(parseDomain("some.localhost")).toMatchObject({
			domains: ["some", "localhost"],
		});
		expect(parseDomain("test")).toMatchObject({
			domains: ["test"],
		});
		expect(parseDomain("www.some.local")).toMatchObject({
			domains: ["www", "some", "local"],
		});
	});

	test("returns type ParseResultType.Reserved for an empty string", () => {
		expect(parseDomain("")).toMatchObject({
			type: ParseResultType.Reserved,
		});
	});

	test("returns an empty domains array for an empty string", () => {
		expect(parseDomain("")).toMatchObject({
			domains: [],
		});
	});

	test("returns type ParseResultType.NotListed for valid hostnames that are not listed", () => {
		expect(parseDomain("valid")).toMatchObject({
			type: ParseResultType.NotListed,
		});
		expect(parseDomain("this.is.not-listed")).toMatchObject({
			type: ParseResultType.NotListed,
		});
	});

	test("returns an array of domain labels for valid hostnames that are not listed", () => {
		expect(parseDomain("valid")).toMatchObject({
			domains: ["valid"],
		});
		expect(parseDomain("this.is.not-listed")).toMatchObject({
			domains: ["this", "is", "not-listed"],
		});
	});

	test("returns type ParseResultType.Invalid and error information for a hostname with an empty label", () => {
		expect(parseDomain(".example.com")).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.LabelMinLength,
					message:
						'Label "" is too short. Label is 0 octets long but should be at least 1.',
					column: 1,
				}),
			]),
		});
		expect(parseDomain("www..example.com")).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					column: 5,
				}),
			]),
		});
	});

	test("returns type ParseResultType.Invalid for the domain '.'", () => {
		expect(parseDomain(".")).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.LabelMinLength,
				}),
			]),
		});
	});

	test("returns type ParseResultType.Invalid and error information for a hostname with a label that is too long", () => {
		const labelToLong = new Array(64).fill("x").join("");

		expect(parseDomain(`${labelToLong}.example.com`)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.LabelMaxLength,
					message: `Label "${labelToLong}" is too long. Label is 64 octets long but should not be longer than 63.`,
					column: 1,
				}),
			]),
		});
		expect(parseDomain(`www.${labelToLong}.example.com`)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					column: 5,
				}),
			]),
		});
	});

	test("returns type ParseResultType.Invalid and error information for a hostname that is too long", () => {
		const domain = new Array(127).fill("x").join(".") + "x";

		expect(parseDomain(domain)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.DomainMaxLength,
					message: `Domain "${domain}" is too long. Domain is 254 octets long but should not be longer than 253.`,
					column: 254,
				}),
			]),
		});
	});

	test("returns type ParseResultType.Invalid and error information for a hostname that contains an invalid character", () => {
		expect(parseDomain("some-静")).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.LabelInvalidCharacter,
					message:
						'Label "some-静" contains invalid character "静" at column 5.',
					column: 5,
				}),
			]),
		});
		expect(parseDomain("some-静.com")).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.LabelInvalidCharacter,
					message:
						'Label "some-静" contains invalid character "静" at column 5.',
					column: 5,
				}),
			]),
		});
	});

	test("returns type ParseResultType.Invalid and error information if the input was not domain like", () => {
		/* eslint-disable @typescript-eslint/ban-ts-ignore, no-null/no-null */
		// @ts-ignore
		expect(parseDomain(undefined)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.NoHostname,
					message: "The given input undefined does not look like a hostname.",
					column: 1,
				}),
			]),
		});
		// @ts-ignore
		expect(parseDomain(null)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.NoHostname,
					message: "The given input null does not look like a hostname.",
					column: 1,
				}),
			]),
		});
		// @ts-ignore
		expect(parseDomain(true)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.NoHostname,
					message: "The given input true does not look like a hostname.",
					column: 1,
				}),
			]),
		});
		// @ts-ignore
		expect(parseDomain(1)).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.NoHostname,
					message: "The given input 1 does not look like a hostname.",
					column: 1,
				}),
			]),
		});
		/* eslint-enable */
	});

	test("returns type ParseResultType.Invalid and error information if the input was not an URL", () => {
		expect(parseDomain(fromUrl(""))).toMatchObject({
			type: ParseResultType.Invalid,
			errors: expect.arrayContaining([
				expect.objectContaining({
					type: ValidationErrorType.NoHostname,
					message:
						"The given input Symbol(NO_HOSTNAME) does not look like a hostname.",
					column: 1,
				}),
			]),
		});
	});

	test("accepts a trailing dot as valid root label", () => {
		expect(parseDomain("www.example.com.")).toMatchObject({
			subDomains: ["www"],
			domain: "example",
			topLevelDomains: ["com"],
		});
	});

	test("accepts uppercase letters and preserves the case", () => {
		expect(parseDomain("WWW.EXAMPLE.COM")).toMatchObject({
			subDomains: ["WWW"],
			domain: "EXAMPLE",
			topLevelDomains: ["COM"],
		});
	});

	test("accepts hyphens", () => {
		expect(parseDomain("w-w-w.e-x-a-m-p-l-e.com")).toMatchObject({
			subDomains: ["w-w-w"],
			domain: "e-x-a-m-p-l-e",
			topLevelDomains: ["com"],
		});
	});

	test("accepts numbers", () => {
		expect(parseDomain("123.456.com")).toMatchObject({
			subDomains: ["123"],
			domain: "456",
			topLevelDomains: ["com"],
		});
	});

	test("returns the input hostname in the result", () => {
		expect(parseDomain("www.example.com")).toMatchObject({
			hostname: "www.example.com",
		});
		expect(parseDomain("www.example.test")).toMatchObject({
			hostname: "www.example.test",
		});
	});
});
