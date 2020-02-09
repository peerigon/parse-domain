import nock from "nock";
import {PUBLIC_SUFFIX_URL, PUBLIC_SUFFIX_FETCH_TIMEOUT} from "../config";
import {fetchPsl} from "./fetch-psl";
import {readPslFixture} from "../tests/fixtures/fixtures";

describe("fetchPsl()", () => {
	const publicSuffixUrl = new URL(PUBLIC_SUFFIX_URL);
	let pslFixture: string;

	beforeAll(async () => {
		pslFixture = await readPslFixture();
	});

	beforeEach(() => {
		jest.useFakeTimers();
		nock.cleanAll();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test("fetches the public suffix list as text", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.reply(200, pslFixture);

		const list = await fetchPsl();

		expect(list).toEqual(pslFixture);
	});

	test("times out after PUBLIC_SUFFIX_FETCH_TIMEOUT", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.delayConnection(PUBLIC_SUFFIX_FETCH_TIMEOUT + 1000)
			.reply(200, "");

		const listPromise = fetchPsl();

		jest.advanceTimersByTime(PUBLIC_SUFFIX_FETCH_TIMEOUT);

		await expect(listPromise).rejects.toThrowErrorMatchingInlineSnapshot(
			'"Cannot fetch public suffix list: Request timeout after 60000 milliseconds"',
		);
	});

	test("throws an error if the public suffix list is not long enough", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.reply(200, "");

		const listPromise = fetchPsl();

		await expect(listPromise).rejects.toThrowErrorMatchingInlineSnapshot(
			`"Public suffix list is shorter than expected"`,
		);
	});
});
