Alpheios Lexical Tests - command line versiom

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/alpheios-project/lexicon-client.svg?branch=master)](https://travis-ci.org/alpheios-project/lexicon-client)
[![Coverage Status](https://coveralls.io/repos/github/alpheios-project/lexicon-client/badge.svg?branch=master)](https://coveralls.io/github/alpheios-project/lexicon-client?branch=master)

# Usage

## Prerequisites

* Node >= 7

## Install Dependencies

```
npm install
```

## Examples:
### from dist folder using node.js
```
node alpheios-lt-cmdtool dataFile paramsFile configFile
```

### from packaged folder (node.js is packed inside, so you don't need to setup node.js)
### Linux
```
alpheios-lt-cmdtool-linux dataFile paramsFile configFile
```
### Mac OS
```
alpheios-lt-cmdtool-macos dataFile paramsFile configFile
```
### Windows
```
alpheios-lt-cmdtool-win dataFile paramsFile configFile
```

## Parameters:

**dataFile** - *optional* - json file (default = **data.json**)

**paramsFile** - *optional* - json file (default = **params.json**)

**configFile** - *optional* - json file (default = **config.json**)


### paramsFile:

| Name | Type | Obligatory | Default | Description |
|------|------|------------|---------|-------------|
| **tabDelimiter** | String | | `\t` | Delimiter is used in .csv files |
| **langs** | Array of Strings | | `[]` | Used for defining translation's languages to translation-client  |
| **skipShortDefs** | Boolean | | `false` | Define if requests for short definitions should be skipped |
| **skipFullDefs** | Boolean | | `false` | Define if requests for full definitions should be skipped |
| **downloadMorph** | Boolean | | `false` | Define if CSV with morph data should be created |
| **downloadShortDef** | Boolean | | `false` | Define if CSV with short definitions should be created |
| **downloadFullDef** | Boolean | | `false` | Define if CSV with full definitions should be created |
| **downloadTranslations** | Boolean | | `false` | Define if CSV with translations should be created |
| **downloadFailedMorph** | Boolean | | `false` | Define if CSV with failed words from morph-client should be created |
| **downloadFailedShortDef** | Boolean | | `false` | Define if CSV with words failed to get short definitions from lexical-client should be created |
| **downloadFailedFullDef** | Boolean | | `false` | Define if CSV with words failed to get full definitions from lexical-client should be created |
| **downloadFailedTranslations** | Boolean | | `false` | Define if CSV with words failed to get translations from lemma-client should be created |
| **downloadFailedAnything** | Boolean | | `false` | Define if CSV with words failed in any case should be created |


### dataFile (variant 1) - Object:

| Name | Type | Obligatory | Default | Description |
|------|------|------------|---------|-------------|
| **queue_max** | Integer | | 2 | The amount of parallel requests (by target word) |
| **data** | Array of Objects | + |  | The array ob objects, each one defines a word and it's options for collecting data, The object structure should be the same as desacribed in the **dataFile (variant 2)** |


### dataFile (variant 2) - array:

| Name | Obligatory | Default | Description |
|------|------------|---------|-------------|
| **targetWord** | + |  | A word for collecting data about |
| **languageCode** | + |  | A language identifier of the target word - variants are defined in configFile - lat, grc, per, ara |
| **lexiconShortOpts** |  |  | There are 3 variants of defining this parameter: <br> * no data at all, fetch for short definitions will be skipped <br>* empty object or `{ "codes": [] }`, fetch for short definitions will be done for all available dictionaries <br>* `{ "codes": ["lsj"] }` - with defined dictionary codes in `code` array, fetch for short definitions will be done for pointed dictionaries |
| **lexiconShortOpts** |  |  | It is the same as for **lexiconShortOpts** |


