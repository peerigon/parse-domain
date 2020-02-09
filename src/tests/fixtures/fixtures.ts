import {promises as fs} from "fs";
import {resolve} from "path";

const pathToPslFixture = resolve(__dirname, "public-suffix-list.txt");

export const readPslFixture = async () => {
	return await fs.readFile(pathToPslFixture, "utf8");
};
