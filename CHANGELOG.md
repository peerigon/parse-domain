# [8.1.0](https://github.com/peerigon/parse-domain/compare/v8.0.2...v8.1.0) (2024-07-26)


### Features

* Use Node's built-in fetch ([#164](https://github.com/peerigon/parse-domain/issues/164)) ([7333a7d](https://github.com/peerigon/parse-domain/commit/7333a7d54737ff9e21bce495a8d94f25732bc269))

## [8.0.2](https://github.com/peerigon/parse-domain/compare/v8.0.1...v8.0.2) (2024-03-04)

### Bug Fixes

- Add `ParseResultIp` to `main.js` exports ([#157](https://github.com/peerigon/parse-domain/issues/157)) ([b5b0177](https://github.com/peerigon/parse-domain/commit/b5b01778a2dbea4507bf5fff347a282b1531a59b))

## [8.0.1](https://github.com/peerigon/parse-domain/compare/v8.0.0...v8.0.1) (2023-10-27)

### Bug Fixes

- Inline sourceContents in source maps ([#156](https://github.com/peerigon/parse-domain/issues/156)) ([2f5a249](https://github.com/peerigon/parse-domain/commit/2f5a249b3115d992f9a746dc5c42de4d5dfd5ddb)), closes [#149](https://github.com/peerigon/parse-domain/issues/149)

# [8.0.0](https://github.com/peerigon/parse-domain/compare/v7.0.1...v8.0.0) (2023-10-27)

### chore

- Update node version ([#154](https://github.com/peerigon/parse-domain/issues/154)) ([3a8b92b](https://github.com/peerigon/parse-domain/commit/3a8b92bd63bc3469a5ed953e6177f64a30cba5eb))

### BREAKING CHANGES

- Dropped official support for Node 12, 14 and 16. There wasn't any actual breaking change we know of but use at your own risk :)

## [7.0.1](https://github.com/peerigon/parse-domain/compare/v7.0.0...v7.0.1) (2022-06-30)

### Bug Fixes

- Parse error with : when using fromUrl() ([09071e6](https://github.com/peerigon/parse-domain/commit/09071e6202e029b05743d40806a0bfccb2fb44c0)), closes [#140](https://github.com/peerigon/parse-domain/issues/140)

# [7.0.0](https://github.com/peerigon/parse-domain/compare/v6.0.1...v7.0.0) (2022-01-23)

### Bug Fixes

- Add support for invalid ipv6 URLs ([b32d16c](https://github.com/peerigon/parse-domain/commit/b32d16cee9c851465d350da2cdabe4bdee846ac9)), closes [#114](https://github.com/peerigon/parse-domain/issues/114)
- Remove auto-trimming of input ([4ea86a1](https://github.com/peerigon/parse-domain/commit/4ea86a189eb4f02af170836b703d9c73885344b7))

### BREAKING CHANGES

- parseDomain won't .trim() the given input. The input is interpreted as it is. If you want to trim the input, you need to call .trim() before passing it to parseDomain. Auto-trimming the input changes the domain and might not be desired if any character (such as whitespace) is allowed (e.g. when using lax validation).

## [6.0.1](https://github.com/peerigon/parse-domain/compare/v6.0.0...v6.0.1) (2022-01-23)

### Bug Fixes

- Wrong package exports 🤦‍♀️ ([45c5e0c](https://github.com/peerigon/parse-domain/commit/45c5e0ccd8433be722a5365086b85e615bbcef67))

# [6.0.0](https://github.com/peerigon/parse-domain/compare/v5.0.0...v6.0.0) (2022-01-23)

- Migrate package to ECMAScript modules ([42f54e8](https://github.com/peerigon/parse-domain/commit/42f54e8010c077c5375f0c96ab35a12bad35d3f4))

### BREAKING CHANGES

- parse-domain will now be released as native ECMAScript module. There's no CommonJS build anymore. If you're still using CommonJS, you need to import it asynchronously using `await import("parse-domain")`. If you're still using Node 12, you may need to update it to the latest 12.x version.

# [5.0.0](https://github.com/peerigon/parse-domain/compare/v4.1.0...v5.0.0) (2022-01-23)

### Bug Fixes

- Type errors with is-ip module ([8ea728c](https://github.com/peerigon/parse-domain/commit/8ea728c0327f5f057a687122e95996d8bbb0700d))

### Features

- Improve validation ([171a8c8](https://github.com/peerigon/parse-domain/commit/171a8c88b99f415653292efd5558e34445ec8721))

### BREAKING CHANGES

- Introduces a dependency on the global `TextEncoder` constructor which should be available in all modern engines
  (see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder). The strict validation mode (which is the default) will also be a little bit more strict since it will now also check for hyphens at the beginning or end of a domain label. It also requires top-level domain names not to be all-numeric.

# [4.1.0](https://github.com/peerigon/parse-domain/compare/v4.0.0...v4.1.0) (2021-09-03)

### Features

- Switch to MIT license ([05bc1c0](https://github.com/peerigon/parse-domain/commit/05bc1c0dd181331042403540ca7abcffae7ead23))

# [4.0.0](https://github.com/peerigon/parse-domain/compare/v3.0.4...v4.0.0) (2021-09-02)

### chore

- Change supported Node versions ([202ff9f](https://github.com/peerigon/parse-domain/commit/202ff9fd19d2509f930fdd55129d08a5327d0d5e))

### BREAKING CHANGES

- Node versions below 12 are not officially supported anymore.

## [3.0.4](https://github.com/peerigon/parse-domain/compare/v3.0.3...v3.0.4) (2021-09-02)

### Bug Fixes

- Improve scheme support in `fromUrl` ([4c10202](https://github.com/peerigon/parse-domain/commit/4c1020283279d3a6871d37dfdcda697ef78a81d2)), closes [#section-3](https://github.com/peerigon/parse-domain/issues/section-3) [#130](https://github.com/peerigon/parse-domain/issues/130)

## [3.0.3](https://github.com/peerigon/parse-domain/compare/v3.0.2...v3.0.3) (2020-10-20)

### Bug Fixes

- Add check for global URL constructor in fromUrl() ([#119](https://github.com/peerigon/parse-domain/issues/119)) ([4e32480](https://github.com/peerigon/parse-domain/commit/4e3248096a50fc6f5cb35935f6f44bee72efd150))

## [3.0.2](https://github.com/peerigon/parse-domain/compare/v3.0.1...v3.0.2) (2020-05-06)

### Bug Fixes

- Add types to package.json ([#110](https://github.com/peerigon/parse-domain/issues/110)) ([849ff1a](https://github.com/peerigon/parse-domain/commit/849ff1a932f034e57d51ba70534127d6a8109337))

## [3.0.1](https://github.com/peerigon/parse-domain/compare/v3.0.0...v3.0.1) (2020-04-24)

### Bug Fixes

- npx parse-domain-update broken ([#105](https://github.com/peerigon/parse-domain/issues/105)) ([9070030](https://github.com/peerigon/parse-domain/commit/907003044760b1ca9713ec7d0e48e9bd208daa9d))

# [3.0.0](https://github.com/peerigon/parse-domain/compare/v2.3.4...v3.0.0) (2020-04-23)

### Features

- Complete rewrite in TypeScript and several bug fixes and improvements ([9f38492](https://github.com/peerigon/parse-domain/commit/9f384921015ab962975ae1d3833507dd7ec0cc52))

### BREAKING CHANGES

- This release is a complete rewrite in TypeScript. It fixes some long outstanding bugs and comes with improvements we were planning for quite some time. The major changes are: 1. parseDomain does not accept whole URLs anymore. Only the hostname section of a URL is allowed now. 2. We removed the options object. Custom TLDs are returned as "valid but not listed". The parse result contains both the result with private TLDs and without private TLDs. 3. Dropped Node 6 support. We recommend reading the README since the public API as changed quite a lot.

# [3.0.0-beta.10](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.9...v3.0.0-beta.10) (2020-04-23)

### Features

- Trigger beta release for next major version ([5443240](https://github.com/peerigon/parse-domain/commit/5443240d009b21284d707d6d22a1656970f8a699))

# [3.0.0-beta.9](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.8...v3.0.0-beta.9) (2020-04-20)

### Bug Fixes

- Cache in release job ([60557b2](https://github.com/peerigon/parse-domain/commit/60557b2a5e1a02669e4649c38dfc7148adc37b60))

# [3.0.0-beta.8](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.7...v3.0.0-beta.8) (2020-04-20)

### Bug Fixes

- Cache in GitHub actions ([28761fc](https://github.com/peerigon/parse-domain/commit/28761fc42b05c474a3c0677743270c1354bfbf59))

# [3.0.0-beta.7](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.6...v3.0.0-beta.7) (2020-04-20)

### Bug Fixes

- GitHub actions ([40fe150](https://github.com/peerigon/parse-domain/commit/40fe150695ae32a61dd7f2695ce787e806b42284))

### Features

- Improve GitHub actions ([be142b7](https://github.com/peerigon/parse-domain/commit/be142b79467dc6de873d5bd88f298273af099ce5))

# [3.0.0-beta.6](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.5...v3.0.0-beta.6) (2020-04-20)

### Bug Fixes

- smoke-test on Node v8 ([0a2b60a](https://github.com/peerigon/parse-domain/commit/0a2b60aa118d66355224e06de79852778dbfe3f4))

# [3.0.0-beta.5](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2020-04-20)

### Features

- Extract smoke test ([f9e996b](https://github.com/peerigon/parse-domain/commit/f9e996bf062727d156c8b1740f1529ee20f45714))

# [3.0.0-beta.4](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2020-04-19)

### Bug Fixes

- ESM and CJS exports for Node 13 ([33eb612](https://github.com/peerigon/parse-domain/commit/33eb6120660c43c03607db22d05269cf7135103a))

# [3.0.0-beta.3](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2020-04-19)

### Features

- Trigger beta release for next major version ([ee785de](https://github.com/peerigon/parse-domain/commit/ee785de33d91a76377af54991d913a8063f8bd81))

# [3.0.0-beta.2](https://github.com/peerigon/parse-domain/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2020-03-15)

### Bug Fixes

- Add missing files in package ([7a770cb](https://github.com/peerigon/parse-domain/commit/7a770cbf9f42af5d0a8b3aec19b0016d05bedf54))

# [3.0.0-beta.1](https://github.com/peerigon/parse-domain/compare/v2.4.0-beta.1...v3.0.0-beta.1) (2020-03-14)

### Features

- Trigger beta release for next major version ([13287a6](https://github.com/peerigon/parse-domain/commit/13287a6a26de87f7767e34de611e698904b7e07c))

### BREAKING CHANGES

- This is a complete rewrite with a changed API

# [2.4.0-beta.1](https://github.com/peerigon/parse-domain/compare/v2.3.2...v2.4.0-beta.1) (2020-03-14)

### Features

- Trigger beta release ([aa859fa](https://github.com/peerigon/parse-domain/commit/aa859fa5113a2e69edeb7e0b45c4a759edc39c51))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.3.4](https://github.com/peerigon/parse-domain/compare/v2.3.3...v2.3.4) (2019-11-02)

### [2.3.3](https://github.com/peerigon/parse-domain/compare/v2.3.2...v2.3.3) (2019-11-02)

### [2.3.2](https://github.com/peerigon/parse-domain/compare/v2.3.1...v2.3.2) (2019-08-10)

### Bug Fixes

- Fix bug when parsing private TLDs ([#79](https://github.com/peerigon/parse-domain/issues/79)) ([69162fc](https://github.com/peerigon/parse-domain/commit/69162fc)), closes [#67](https://github.com/peerigon/parse-domain/issues/67)

### [2.3.1](https://github.com/peerigon/parse-domain/compare/v2.3.0...v2.3.1) (2019-06-14)

### Bug Fixes

- TypeScript definition not available on npm module ([2f4684c](https://github.com/peerigon/parse-domain/commit/2f4684c)), closes [#73](https://github.com/peerigon/parse-domain/issues/73)
- updatedAt timestamp breaks bundle caching ([#75](https://github.com/peerigon/parse-domain/issues/75), [#60](https://github.com/peerigon/parse-domain/issues/60)) ([27199d5](https://github.com/peerigon/parse-domain/commit/27199d5))

## [2.3.0](https://github.com/peerigon/parse-domain/compare/v2.2.1...v2.3.0) (2019-05-29)

### Features

- Add TypeScript typings ([#66](https://github.com/peerigon/parse-domain/issues/66)) ([10b6693](https://github.com/peerigon/parse-domain/commit/10b6693))

### [2.2.1](https://github.com/peerigon/parse-domain/compare/v2.2.0...v2.2.1) (2019-05-28)

### Bug Fixes

- Fix 'run-s: command not found' on postinstall ([ce42e2e](https://github.com/peerigon/parse-domain/commit/ce42e2e)), closes [#72](https://github.com/peerigon/parse-domain/issues/72)
- Fix problem where malformed URLs threw an error ([#70](https://github.com/peerigon/parse-domain/issues/70)) ([28d7e4b](https://github.com/peerigon/parse-domain/commit/28d7e4b))

## [2.2.0](https://github.com/peerigon/parse-domain/compare/v2.1.8...v2.2.0) (2019-05-27)

### Features

- Remove runtime dependency on npm ([ad6ced2](https://github.com/peerigon/parse-domain/commit/ad6ced2))

### [2.1.8](https://github.com/peerigon/parse-domain/compare/v2.1.7...v2.1.8) (2019-05-27)

### Bug Fixes

- Add timeout to download public suffix list ([#56](https://github.com/peerigon/parse-domain/issues/56)) ([1fbd49c](https://github.com/peerigon/parse-domain/commit/1fbd49c))
- Fix error where a lot of domains were not detected ([fc80789](https://github.com/peerigon/parse-domain/commit/fc80789)), closes [#64](https://github.com/peerigon/parse-domain/issues/64)
- Fix sanity check during npm run build:tries ([a3c1eeb](https://github.com/peerigon/parse-domain/commit/a3c1eeb))
- Fix thrown error with input that only contains whitespaces ([1d1a24a](https://github.com/peerigon/parse-domain/commit/1d1a24a)), closes [#32](https://github.com/peerigon/parse-domain/issues/32) [#61](https://github.com/peerigon/parse-domain/issues/61)

<a name="2.1.7"></a>

## [2.1.7](https://github.com/peerigon/parse-domain/compare/v2.1.6...v2.1.7) (2018-11-27)

- Update dependencies [#57](https://github.com/peerigon/parse-domain/pull/57). Removes malicious code which has been introduced by event-stream ([more information](https://snyk.io/blog/malicious-code-found-in-npm-package-event-stream)).

<a name="2.1.6"></a>

## [2.1.6](https://github.com/peerigon/parse-domain/compare/v2.1.5...v2.1.6) (2018-10-19)

### Bug Fixes

- Broken published version ([f36d76e](https://github.com/peerigon/parse-domain/commit/f36d76e))

<a name="2.1.5"></a>

## [2.1.5](https://github.com/peerigon/parse-domain/compare/v2.1.4...v2.1.5) (2018-10-19)

### Bug Fixes

- Compatibility problems with older JavaScript engines ([#51](https://github.com/peerigon/parse-domain/issues/51)) ([d9d782b](https://github.com/peerigon/parse-domain/commit/d9d782b))

<a name="2.1.4"></a>

## [2.1.4](https://github.com/peerigon/parse-domain/compare/v2.1.3...v2.1.4) (2018-10-19)

### Bug Fixes

- Wrong entry in package.json files ([50fe635](https://github.com/peerigon/parse-domain/commit/50fe635))

<a name="2.1.3"></a>

## [2.1.3](https://github.com/peerigon/parse-domain/compare/v2.1.2...v2.1.3) (2018-10-19)

### Bug Fixes

- Do not write in the file system on postinstall if it's forbidden ([#39](https://github.com/peerigon/parse-domain/issues/39)) ([9aee180](https://github.com/peerigon/parse-domain/commit/9aee180))
- Re-add missing prepare script after ([e5d6362](https://github.com/peerigon/parse-domain/commit/e5d6362))

<a name="2.1.2"></a>

## [2.1.2](https://github.com/peerigon/parse-domain/compare/v2.1.1...v2.1.2) (2018-06-13)

### Bug Fixes

- Add .babelrc for create-react-app apps ([#37](https://github.com/peerigon/parse-domain/issues/37)) ([d2d3728](https://github.com/peerigon/parse-domain/commit/d2d3728))

<a name="2.1.1"></a>

## [2.1.1](https://github.com/peerigon/parse-domain/compare/v2.1.0...v2.1.1) (2018-05-30)

### Bug Fixes

- Support url which has no protocol ([#28](https://github.com/peerigon/parse-domain/issues/28)) ([74dec41](https://github.com/peerigon/parse-domain/commit/74dec41))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/peerigon/parse-domain/compare/v2.0.0...v2.1.0) (2018-05-30)

### Features

- Use trie data structure to decrease file size ([#33](https://github.com/peerigon/parse-domain/issues/33)) ([59f951b](https://github.com/peerigon/parse-domain/commit/59f951b))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/peerigon/parse-domain/compare/v1.2.0...v2.0.0) (2017-12-03)

### Code Refactoring

- Update code to node 4 ([4d87f43](https://github.com/peerigon/parse-domain/commit/4d87f43))

### Features

- Update list of TLDs ([df15b19](https://github.com/peerigon/parse-domain/commit/df15b19))

### BREAKING CHANGES

- node 4 or newer is required

<a name="1.2.0"></a>

# [1.2.0](https://github.com/peerigon/parse-domain/compare/v1.1.0...v1.2.0) (2017-12-03)

## Changelog

### 1.1.0

- Fix parsing of URLs that have an @ character in the path [#13](https://github.com/peerigon/parse-domain/issues/13)
- Update tlds a27a2c83102c563978b831bd161f1fb5409376bd

### 1.0.0

- Removed private tlds from the default regexp [#4](https://github.com/peerigon/parse-domain/issues/4) [#6](https://github.com/peerigon/parse-domain/issues/6)
- Introduced `privateTlds` boolean flag to include private tlds
- Reached stable state :)
