# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Include `updateSalesChannel` mutation and not rely on the mutation in `binding-selector app` and be able to remove it from peerDependencies.

### Added

- Add README with instruction about the app.
- Translation configuration file.

## [1.0.3] - 2022-01-26

### Fixed

- Change method to get `orderFormId` to avoid error loading the app when user hits the store for the first time

## [1.0.2] - 2022-01-25

### Fixed

- Remove `contentSchemas.json` and add it in the schemas on `interfaces.json`

## [1.0.1] - 2022-01-25

### Fixed

- Set relative path to reference `$ref` from interfaces.json to `contentSchemas.json`

## [1.0.0] - 2022-01-25
