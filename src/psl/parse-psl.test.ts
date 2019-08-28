import {readFileSync} from "fs";
import {resolve} from "path";
import {parsePublicSuffixList} from "./parse-psl";

describe("parsePublicSuffixList()", () => {
	const pathToPslFixture = resolve(
		__dirname,
		"..",
		"tests",
		"fixtures",
		"public-suffix-list.txt",
	);

	const fixtureContent = readFileSync(pathToPslFixture, "utf8");

	test("It matches the snapshot when given the test fixture", () => {
		const result = parsePublicSuffixList(fixtureContent);

		expect(result).toMatchSnapshot();
	});
});
