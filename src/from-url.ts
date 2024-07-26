const urlPattern = /^[a-z][*+.a-z-]+:\/\//i;
const invalidIpv6Pattern =
  /^([a-z][*+.a-z-]+:\/\/)([^[][^/?]*:[^/?]*:[^/?]*)(.*)/i;

export const NO_HOSTNAME: unique symbol = Symbol("NO_HOSTNAME");

export const fromUrl = (urlLike: string) => {
  /* istanbul ignore next */
  if (typeof URL !== "function") {
    throw new Error(
      "Looks like the new URL() constructor is not globally available in your environment. Please make sure to use a polyfill.",
    );
  }

  // Extra check for non-TypeScript users
  if (typeof urlLike !== "string") {
    return NO_HOSTNAME;
  }

  // URLs that start with // are protocol relative
  let url = urlLike.startsWith("//")
    ? `http:${urlLike}`
    : // URLs that start with / do not have a hostname section
      urlLike.startsWith("/")
      ? urlLike
      : urlPattern.test(urlLike)
        ? urlLike
        : `http://${urlLike}`;

  url = url.replace(invalidIpv6Pattern, "$1[$2]$3");

  try {
    return new URL(url).hostname;
  } catch {
    return NO_HOSTNAME;
  }
};
