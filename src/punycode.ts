export const toASCII = (hostname: string): string => {
  return new URL(`http://${hostname}`).hostname;
};
