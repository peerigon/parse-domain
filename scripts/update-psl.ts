import {update} from "../src/update";

update().catch((error) => {
	setTimeout(() => {
		throw error;
	});
});
