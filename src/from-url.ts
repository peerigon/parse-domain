// eslint-disable-next-line import/default
import isIp from "is-ip";

const urlPattern = /^[a-z]+:\/\//i;

export const NO_HOSTNAME: unique symbol = Symbol("NO_HOSTNAME");

export const fromUrl = (urlLike: string) => {
	// Extra check for non-TypeScript users
	if (typeof urlLike !== "string") {
		return NO_HOSTNAME;
	}

	// URLs that start with // are protocol relative
	const url = urlLike.startsWith("//")
		? `http:${urlLike}`
		: // URLs that start with / do not have a hostname section
		urlLike.startsWith("/")
		? urlLike
		: urlPattern.test(urlLike)
		? urlLike
		: `http://${urlLike}`;

	let hostname;

	try {
		hostname = new URL(url).hostname;
	} catch {
		return NO_HOSTNAME;
	}

	if (isIp(hostname)) {
		return NO_HOSTNAME;
	}

	return hostname;
};
