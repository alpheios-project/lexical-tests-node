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

| Name | Obligatory | Default | Description |
|------|------------|---------|-------------|
| **tabDelimiter** | | `\t` | Delimiter is used in .csv files |
| **langs** | | `[]` | Used for defining translation's languages to translation-client  |
| **skipShortDefs** | | `false` | Define if requests for short definitions should be skipped |
| **skipFullDefs** | | `false` | Define if requests for full definitions should be skipped |
| **downloadMorph** | | `false` | Define if CSV with morph data should be created |
| **downloadShortDef** | | `false` | Define if CSV with short definitions should be created |
| **downloadFullDef** | | `false` | Define if CSV with full definitions should be created |
| **downloadTranslations** | | `false` | Define if CSV with translations should be created |
| **downloadFailedMorph** | | `false` | Define if CSV with failed words from morph-client should be created |
| **downloadFailedShortDef** | | `false` | Define if CSV with words failed to get short definitions from lexical-client should be created |
| **downloadFailedFullDef** | | `false` | Define if CSV with words failed to get full definitions from lexical-client should be created |
| **downloadFailedTranslations** | | `false` | Define if CSV with words failed to get translations from lemma-client should be created |
| **downloadFailedAnything** | | `false` | Define if CSV with words failed in any case should be created |

### dataFile (variant 1) - array:

| Name | Obligatory | Default | Description |
|------|------------|---------|-------------|
| **targetWord** | + |  | A word for collecting data about |
| **languageCode** | + |  | A language identifier of the target word - variants are defined in configFile - lat, grc, per, ara |
| **lexiconShortOpts** |  |  | There are 3 variants of defining this parameter: 
|                      |  |  |   * no data at all, fetch for short definitions will be skipped
|                      |  |  |   * empty object or `{ "codes": [] }`, fetch for short definitions will be done for all available dictionaries
|                      |  |  |   * `{ "codes": ["lsj"] }` - with defined dictionary codes in `code` array, 
|                      |  |  |     fetch for short definitions will be done for pointed dictionaries |
