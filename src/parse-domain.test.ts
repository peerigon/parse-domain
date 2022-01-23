import { parseDomain, ParseResultType } from "./parse-domain";
import { Validation, ValidationErrorType } from "./sanitize";
import { fromUrl } from "./from-url";

const ipV6Samples = [
  "::",
  "1::",
  "::1",
  "1::8",
  "1::7:8",
  "1:2:3:4:5:6:7:8",
  "1:2:3:4:5:6::8",
  "1:2:3:4:5:6:7::",
  "1:2:3:4:5::7:8",
  "1:2:3:4:5::8",
  "1:2:3::8",
  "1::4:5:6:7:8",
  "1::6:7:8",
  "1::3:4:5:6:7:8",
  "1:2:3:4::6:7:8",
  "1:2::4:5:6:7:8",
  "::2:3:4:5:6:7:8",
  "1:2::8",
  "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "2001:db8:85a3:0:0:8a2e:370:7334",
];

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

  test("returns type ParseResultType.Ip for IPv4 addresses", () => {
    [
      "0.0.0.0",
      "8.8.8.8",
      "127.0.0.1",
      "100.100.100.100",
      "192.168.0.1",
      "18.101.25.153",
    ].forEach((ipAddress) => {
      expect(parseDomain(ipAddress)).toMatchObject({
        type: ParseResultType.Ip,
        hostname: ipAddress,
        ipVersion: 4,
      });
    });
  });

  test("returns type ParseResultType.Ip for IPv6 addresses", () => {
    ipV6Samples.forEach((ipAddress) => {
      expect(parseDomain(ipAddress)).toMatchObject({
        type: ParseResultType.Ip,
        hostname: ipAddress,
        ipVersion: 6,
      });
    });
  });

  test("returns type ParseResultType.Ip for IPv6 addresses with square brackets according to RFC 3986", () => {
    ipV6Samples.forEach((ipAddress) => {
      expect(parseDomain("[" + ipAddress + "]")).toMatchObject({
        type: ParseResultType.Ip,
        hostname: ipAddress,
        ipVersion: 6,
      });
    });
  });

  test("returns type ParseResultType.Reserved for all reserved TLDs according to RFC 6761, 6762", () => {
    expect(parseDomain("example")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: ["example"],
    });
    // We decided to treat .invalid domains not in a special way.
    expect(parseDomain("some.invalid")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: ["some", "invalid"],
    });
    expect(parseDomain("some.localhost")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: ["some", "localhost"],
    });
    expect(parseDomain("test")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: ["test"],
    });
    expect(parseDomain("www.some.local")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: ["www", "some", "local"],
    });
  });

  test("returns type ParseResultType.Reserved for an empty string", () => {
    expect(parseDomain("")).toMatchObject({
      type: ParseResultType.Reserved,
      labels: [],
    });
  });

  test("returns type ParseResultType.NotListed for valid hostnames that are not listed", () => {
    expect(parseDomain("valid")).toMatchObject({
      type: ParseResultType.NotListed,
      labels: ["valid"],
    });
    expect(parseDomain("this.is.not-listed")).toMatchObject({
      type: ParseResultType.NotListed,
      labels: ["this", "is", "not-listed"],
    });
  });

  test("returns type ParseResultType.Invalid and error information for a hostname with an empty label (both validation modes)", () => {
    [Validation.Lax, Validation.Strict].forEach((validation) => {
      expect(parseDomain(".example.com", { validation })).toMatchObject({
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

  test("returns type ParseResultType.Invalid and error information for a hostname with a label that is too long (both validation modes)", () => {
    const labelToLong = new Array(64).fill("x").join("");

    [Validation.Lax, Validation.Strict].forEach((validation) => {
      expect(parseDomain(labelToLong, { validation })).toMatchObject({
        type: ParseResultType.Invalid,
        errors: expect.arrayContaining([
          expect.objectContaining({
            type: ValidationErrorType.LabelMaxLength,
            message: `Label "${labelToLong}" is too long. Label is 64 octets long but should not be longer than 63.`,
            column: 1,
          }),
        ]),
      });
      expect(
        parseDomain(`www.${labelToLong}.example.com`, { validation })
      ).toMatchObject({
        type: ParseResultType.Invalid,
        errors: expect.arrayContaining([
          expect.objectContaining({
            column: 5,
          }),
        ]),
      });
    });
    // Should work with 63 octets
    expect(parseDomain(new Array(63).fill("x").join(""))).toMatchObject({
      type: ParseResultType.NotListed,
    });
  });

  test("returns type ParseResultType.Invalid and error information for a hostname that is too long", () => {
    const domain = new Array(254).fill("x").join("");

    // A single long label
    expect(parseDomain(new Array(254).fill("x").join(""))).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.DomainMaxLength,
          message: `Domain "${domain}" is too long. Domain is 254 octets long but should not be longer than 253.`,
          column: 254,
        }),
      ]),
    });

    // Multiple labels
    expect(parseDomain(new Array(128).fill("x").join("."))).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.DomainMaxLength,
        }),
      ]),
    });

    // Should work with 253 octets
    expect(parseDomain(new Array(127).fill("x").join("."))).toMatchObject({
      type: ParseResultType.NotListed,
    });
  });

  test("interprets the hostname as octets", () => {
    // The "ä" character is 2 octets long which is why we only need
    // 127 of them to exceed the limit
    const domain = new Array(127).fill("ä").join("");

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
    // Deliberately testing the '[' and ']' character that is removed from IPv6 addresses
    expect(parseDomain("[")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message: 'Label "[" contains invalid character "[" at column 1.',
          column: 1,
        }),
      ]),
    });
    expect(parseDomain("some-label]")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "some-label]" contains invalid character "]" at column 11.',
          column: 11,
        }),
      ]),
    });
    expect(parseDomain("some-静")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "some-静" contains invalid character "静" at column 6.',
          column: 6,
        }),
      ]),
    });
    expect(parseDomain("some-静.com")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "some-静" contains invalid character "静" at column 6.',
          column: 6,
        }),
      ]),
    });
  });

  test("accepts any character as labels with Validation.Lax", () => {
    // Trying out 2^10 characters
    getCharCodesUntil(2 ** 10)
      .map((octet) => String.fromCharCode(octet))
      .filter((hostname) => hostname !== ".")
      .forEach((hostname) => {
        const result = parseDomain(hostname, { validation: Validation.Lax });

        expect(result).toMatchObject({
          type: ParseResultType.NotListed,
        });
      });
  });

  test("returns type ParseResultType.Invalid and error information for a hostname where some labels start or end with a -", () => {
    expect(parseDomain("-example")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "-example" contains invalid character "-" at column 1.',
          column: 1,
        }),
      ]),
    });
    expect(parseDomain("-example.com")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "-example" contains invalid character "-" at column 1.',
          column: 1,
        }),
      ]),
    });
    expect(parseDomain("example-")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "example-" contains invalid character "-" at column 8.',
          column: 8,
        }),
      ]),
    });
    expect(parseDomain("example-.com")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message:
            'Label "example-" contains invalid character "-" at column 8.',
          column: 8,
        }),
      ]),
    });
  });

  test("returns type ParseResultType.Invalid and error information for a hostname where the last label just contains numbers", () => {
    expect(parseDomain("123")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message: 'Last label "123" must not be all-numeric.',
          column: 1,
        }),
      ]),
    });
    expect(parseDomain("example.123")).toMatchObject({
      type: ParseResultType.Invalid,
      errors: expect.arrayContaining([
        expect.objectContaining({
          type: ValidationErrorType.LabelInvalidCharacter,
          message: 'Last label "123" must not be all-numeric.',
          column: 9,
        }),
      ]),
    });
  });

  test("returns type ParseResultType.Invalid and error information if the input was not domain like", () => {
    // @ts-expect-error This is a deliberate error for the test
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
    // @ts-expect-error This is a deliberate error for the test
    // eslint-disable-next-line no-null/no-null
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
    // @ts-expect-error This is a deliberate error for the test
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
    // @ts-expect-error This is a deliberate error for the test
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
    expect(parseDomain("www.EXAMPLE.com")).toMatchObject({
      hostname: "www.EXAMPLE.com",
    });
    expect(parseDomain("www.EXAMPLE.test")).toMatchObject({
      hostname: "www.EXAMPLE.test",
    });
  });
});

const getCharCodesUntil = (length: number) => {
  return Array.from({ length }, (_, i) => i);
};
