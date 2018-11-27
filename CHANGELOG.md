# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.1.7"></a>
## [2.1.7](https://github.com/peerigon/parse-domain/compare/v2.1.6...v2.1.7) (2018-11-27)



<a name="2.1.6"></a>
## [2.1.6](https://github.com/peerigon/parse-domain/compare/v2.1.5...v2.1.6) (2018-10-19)


### Bug Fixes

* Broken published version ([f36d76e](https://github.com/peerigon/parse-domain/commit/f36d76e))



<a name="2.1.5"></a>
## [2.1.5](https://github.com/peerigon/parse-domain/compare/v2.1.4...v2.1.5) (2018-10-19)


### Bug Fixes

* Compatibility problems with older JavaScript engines ([#51](https://github.com/peerigon/parse-domain/issues/51)) ([d9d782b](https://github.com/peerigon/parse-domain/commit/d9d782b))



<a name="2.1.4"></a>
## [2.1.4](https://github.com/peerigon/parse-domain/compare/v2.1.3...v2.1.4) (2018-10-19)


### Bug Fixes

* Wrong entry in package.json files ([50fe635](https://github.com/peerigon/parse-domain/commit/50fe635))



<a name="2.1.3"></a>
## [2.1.3](https://github.com/peerigon/parse-domain/compare/v2.1.2...v2.1.3) (2018-10-19)


### Bug Fixes

* Do not write in the file system on postinstall if it's forbidden ([#39](https://github.com/peerigon/parse-domain/issues/39)) ([9aee180](https://github.com/peerigon/parse-domain/commit/9aee180))
* Re-add missing prepare script after ([e5d6362](https://github.com/peerigon/parse-domain/commit/e5d6362))



<a name="2.1.2"></a>
## [2.1.2](https://github.com/peerigon/parse-domain/compare/v2.1.1...v2.1.2) (2018-06-13)


### Bug Fixes

* Add .babelrc for create-react-app apps ([#37](https://github.com/peerigon/parse-domain/issues/37)) ([d2d3728](https://github.com/peerigon/parse-domain/commit/d2d3728))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/peerigon/parse-domain/compare/v2.1.0...v2.1.1) (2018-05-30)


### Bug Fixes

* Support url which has no protocol ([#28](https://github.com/peerigon/parse-domain/issues/28)) ([74dec41](https://github.com/peerigon/parse-domain/commit/74dec41))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/peerigon/parse-domain/compare/v2.0.0...v2.1.0) (2018-05-30)


### Features

* Use trie data structure to decrease file size ([#33](https://github.com/peerigon/parse-domain/issues/33)) ([59f951b](https://github.com/peerigon/parse-domain/commit/59f951b))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/peerigon/parse-domain/compare/v1.2.0...v2.0.0) (2017-12-03)


### Code Refactoring

* Update code to node 4 ([4d87f43](https://github.com/peerigon/parse-domain/commit/4d87f43))


### Features

* Update list of TLDs ([df15b19](https://github.com/peerigon/parse-domain/commit/df15b19))


### BREAKING CHANGES

* node 4 or newer is required



<a name="1.2.0"></a>
# [1.2.0](https://github.com/peerigon/parse-domain/compare/v1.1.0...v1.2.0) (2017-12-03)



Changelog
---------

### 1.1.0
- Fix parsing of URLs that have an @ character in the path [#13](https://github.com/peerigon/parse-domain/issues/13)
- Update tlds a27a2c83102c563978b831bd161f1fb5409376bd

### 1.0.0
- Removed private tlds from the default regexp [#4](https://github.com/peerigon/parse-domain/issues/4) [#6](https://github.com/peerigon/parse-domain/issues/6)
- Introduced `privateTlds` boolean flag to include private tlds
- Reached stable state :)
