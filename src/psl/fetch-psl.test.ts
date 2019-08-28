import nock from "nock";
import {PUBLIC_SUFFIX_URL, PUBLIC_SUFFIX_FETCH_TIMEOUT} from "../const";
import {fetchPublicSuffixList} from "./fetch-psl";

describe("fetchPublicSuffixList()", () => {
	const publicSuffixUrl = new URL(PUBLIC_SUFFIX_URL);

	beforeEach(() => {
		jest.useFakeTimers();
		nock.cleanAll();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test("It fetches the public suffix list as text", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.reply(200, "Public suffix list");

		const list = await fetchPublicSuffixList();

		expect(list).toEqual("Public suffix list");
	});

	test("It times out after PUBLIC_SUFFIX_FETCH_TIMEOUT", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.delayConnection(Number.MAX_SAFE_INTEGER)
			.reply(200, "Public suffix list");

		const listPromise = fetchPublicSuffixList();

		jest.advanceTimersByTime(PUBLIC_SUFFIX_FETCH_TIMEOUT);

		await expect(listPromise).rejects.toThrowErrorMatchingInlineSnapshot(
			'"Cannot fetch public suffix list: Request timeout after 60000 milliseconds"',
		);
	});
});
