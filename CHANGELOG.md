# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
