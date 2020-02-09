import {promises as fs} from "fs";
import {resolve} from "path";
import nock from "nock";
import {paths, PUBLIC_SUFFIX_URL} from "../config";
import {update} from "./update";
import {readPslFixture} from "../tests/fixtures/fixtures";

describe("update()", () => {
	const publicSuffixUrl = new URL(PUBLIC_SUFFIX_URL);
	const testFs = resolve(__dirname, "..", "tests", "fs", "update");
	const isoDatePattern = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/;
	const pathsEntries = Object.entries(paths);
	let pslFixture: string;

	beforeAll(async () => {
		paths.pathToIcannTrie = resolve(testFs, "icann.json");
		paths.pathToPrivateTrie = resolve(testFs, "private.json");
		paths.pathToTrieInfoFile = resolve(testFs, "info.json");
		pslFixture = await readPslFixture();
	});

	afterAll(() => {
		Object.assign(paths, Object.fromEntries(pathsEntries));
	});

	test("fetches the public suffix and builds tries plus meta information", async () => {
		nock(publicSuffixUrl.origin)
			.get(publicSuffixUrl.pathname)
			.reply(200, pslFixture);

		await update();

		const [icannTrie, privateTrie, trieInfoFile] = await Promise.all(
			[
				paths.pathToIcannTrie,
				paths.pathToPrivateTrie,
				paths.pathToTrieInfoFile,
			].map(async (path) => await fs.readFile(path, "utf8")),
		);

		expect(icannTrie).toMatchSnapshot();
		expect(privateTrie).toMatchSnapshot();

		expect(JSON.parse(trieInfoFile)).toMatchObject({
			updatedAt: expect.stringMatching(isoDatePattern),
		});
	});
});
