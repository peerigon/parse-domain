import { ok } from "assert";
import { FETCH_PSL_EXPECTED_MIN_LENGTH, PUBLIC_SUFFIX_URL } from "../config.js";

export const fetchPsl = async () => {
  const response = await fetch(PUBLIC_SUFFIX_URL);
  const pslContent = await response.text();

  console.log(
    pslContent.length,
    pslContent.slice(0, 100),
    FETCH_PSL_EXPECTED_MIN_LENGTH,
  );

  // Sanity check
  ok(
    pslContent.length >= FETCH_PSL_EXPECTED_MIN_LENGTH,
    "Public suffix list is shorter than expected",
  );

  return pslContent;
};
