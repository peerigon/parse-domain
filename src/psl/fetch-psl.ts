import fetch from "isomorphic-fetch";
import timeout from "p-timeout";
import {PUBLIC_SUFFIX_URL, PUBLIC_SUFFIX_FETCH_TIMEOUT} from "../const";

export const fetchPublicSuffixList = async (): Promise<string> => {
	const response = await timeout(
		fetch(PUBLIC_SUFFIX_URL),
		PUBLIC_SUFFIX_FETCH_TIMEOUT,
		`Cannot fetch public suffix list: Request timeout after ${PUBLIC_SUFFIX_FETCH_TIMEOUT} milliseconds`,
	);

	return response.text();
};
