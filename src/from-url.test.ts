import {fromUrl, NO_HOSTNAME} from "./from-url";

describe(fromUrl.name, () => {
	test("it returns the hostname only", () => {
		expect(fromUrl("https://user@www.example.com:8080/path?query")).toBe(
			"www.example.com",
		);
	});

	test("it handles other protocols well", () => {
		expect(fromUrl("ftp://user@www.example.com:8080/path?query")).toBe(
			"www.example.com",
		);
	});

	test("it accepts incomplete URLs", () => {
		expect(fromUrl("//user@www.example.com:8080/path?query")).toBe(
			"www.example.com",
		);
		expect(fromUrl("user@www.example.com:8080/path?query")).toBe(
			"www.example.com",
		);
		expect(fromUrl("@www.example.com:8080/path?query")).toBe("www.example.com");
		expect(fromUrl("www.example.com:8080/path?query")).toBe("www.example.com");
		expect(fromUrl("com:8080/path?query")).toBe("com");
		expect(fromUrl("com/?query")).toBe("com");
		expect(fromUrl("com?query")).toBe("com");
	});

	test("it returns the root domain for URLs with just the root domain", () => {
		expect(fromUrl(".:8080/path?query")).toBe(".");
		expect(fromUrl("./?query")).toBe(".");
		expect(fromUrl(".?query")).toBe(".");
	});

	test("it returns a puny-encoded hostname", () => {
		expect(fromUrl("http://münchen.de")).toBe("xn--mnchen-3ya.de");
		expect(fromUrl("münchen.de")).toBe("xn--mnchen-3ya.de");
	});

	test("it handles already puny-encoded hostnames well", () => {
		expect(fromUrl("http://xn--mnchen-3ya.de")).toBe("xn--mnchen-3ya.de");
		expect(fromUrl("xn--mnchen-3ya.de")).toBe("xn--mnchen-3ya.de");
	});

	test("it handles URLs with IPv4", () => {
		expect(fromUrl("http://192.168.1.1/path?query")).toBe("192.168.1.1");
		expect(fromUrl("//192.168.1.1")).toBe("192.168.1.1");
		expect(fromUrl("192.168.1.1")).toBe("192.168.1.1");
	});

	test("it handles URLs with IPv6", () => {
		expect(fromUrl("http://[1:2:3:4:5:6:7:8]/path?query")).toBe(
			"[1:2:3:4:5:6:7:8]",
		);
		expect(fromUrl("//[1:2:3:4:5:6:7:8]")).toBe("[1:2:3:4:5:6:7:8]");
		expect(fromUrl("[1:2:3:4:5:6:7:8]")).toBe("[1:2:3:4:5:6:7:8]");
	});

	test("it returns the NO_HOSTNAME symbol for invalid URLs", () => {
		expect(fromUrl(":8080/path?query")).toBe(NO_HOSTNAME);
		expect(fromUrl("/path?query")).toBe(NO_HOSTNAME);
		expect(fromUrl("?query")).toBe(NO_HOSTNAME);
		expect(fromUrl("")).toBe(NO_HOSTNAME);
	});

	test("it returns the NO_HOSTNAME symbol for invalid input types", () => {
		/* eslint-disable @typescript-eslint/ban-ts-ignore, no-null/no-null */
		// @ts-ignore
		expect(fromUrl(undefined)).toBe(NO_HOSTNAME);
		// @ts-ignore
		expect(fromUrl(null)).toBe(NO_HOSTNAME);
		// @ts-ignore
		expect(fromUrl(true)).toBe(NO_HOSTNAME);
		// @ts-ignore
		expect(fromUrl(1)).toBe(NO_HOSTNAME);
		/* eslint-enable */
	});
});
