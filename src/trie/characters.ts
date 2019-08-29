// UP, SAME, DOWN, RESET should not be special regex characters in a character class.
// serialize-trie.ts uses them to
export const UP = "<"; // one level up
export const SAME = ","; // same level
export const DOWN = ">"; // one level down
export const RESET = "|"; // reset level index and start new
export const WILDCARD = "*"; // as defined by publicsuffix.org
export const EXCEPTION = "!"; // as defined by publicsuffix.org
export const matchSeparatorsAtStringEnd = new RegExp(`[${UP}${SAME}${DOWN}${RESET}]+$`, "g");
