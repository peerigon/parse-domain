# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
