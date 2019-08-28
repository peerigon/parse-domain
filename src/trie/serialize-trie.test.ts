import {readFileSync} from "fs";
import {resolve} from "path";
import {serializeTrie} from "./serialize-trie";
import {parsePublicSuffixList} from "../psl/parse-psl";

describe("serializeTrie()", () => {
	const pathToPslFixture = resolve(
		__dirname,
		"..",
		"tests",
		"fixtures",
		"public-suffix-list.txt",
	);

	const fixtureContent = readFileSync(pathToPslFixture, "utf8");

	test("It matches the snapshot when given the parsed test fixture", () => {
		const parsedFixture = parsePublicSuffixList(fixtureContent);

		expect(serializeTrie(parsedFixture.icann)).toMatchSnapshot();
		expect(serializeTrie(parsedFixture.private)).toMatchSnapshot();
	});
});
