import {ok} from "assert";
import fetch from "isomorphic-fetch";
import timeout from "p-timeout";
import {
	FETCH_PSL_EXPECTED_MIN_LENGTH,
	PUBLIC_SUFFIX_URL,
	PUBLIC_SUFFIX_FETCH_TIMEOUT,
} from "../config";

export const fetchPsl = async () => {
	const response = await timeout(
		fetch(PUBLIC_SUFFIX_URL),
		PUBLIC_SUFFIX_FETCH_TIMEOUT,
		`Cannot fetch public suffix list: Request timeout after ${PUBLIC_SUFFIX_FETCH_TIMEOUT} milliseconds`,
	);

	const pslContent = await response.text();

	// Sanity check
	ok(
		pslContent.length >= FETCH_PSL_EXPECTED_MIN_LENGTH,
		"Public suffix list is shorter than expected",
	);

	return pslContent;
};
