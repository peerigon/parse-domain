/**
 * @file Environment variable configuration. This file intentionally exports an `env` object so that
 *   it can easily be auto-imported just by typing `env`. Getters are used so that required env vars
 *   only throw when they are actually accessed. That way you do not always have to supply all env
 *   vars (e.g. when running only a subset of the app). However, it is strongly encouraged to
 *   destructure env vars at the top-level module scope so that errors are thrown immediately:
 *   `const { CI } = env;` Processes should fail immediately if an env var is missing.
 */
import envVar from "env-var";

export const env = {
  get CI(): boolean {
    return envVar.get("CI").default("false").asBool();
  },
};
