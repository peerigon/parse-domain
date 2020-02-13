import {updatePslFixture} from "../src/tests/fixtures/fixtures";

updatePslFixture().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
