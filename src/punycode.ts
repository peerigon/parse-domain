export const toASCII = (hostname: string) => {
  return new URL(`http://${hostname}`).hostname;
};
