Alpheios Lexical Tests - command line versiom

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/alpheios-project/lexicon-client.svg?branch=master)](https://travis-ci.org/alpheios-project/lexicon-client)
[![Coverage Status](https://coveralls.io/repos/github/alpheios-project/lexicon-client/badge.svg?branch=master)](https://coveralls.io/github/alpheios-project/lexicon-client?branch=master)

## Usage

### Prerequisites

* Node >= 7

### Install Dependencies

```
npm install
```

### Examples:
```
node cmdtools paramsFile dataFile configFile
```

## Parameters:

**paramsFile** - *optional* - json file (default = **params.json**)

**dataFile** - *optional* - json file (default = **data.json**)

**configFile** - *optional* - json file (default = **config.json**)


## paramsFile:

{
  "tabDelimiter": "\t",

  "langs": ["en-US", "it", "pt", "ca", "fr", "de", "es"],

  "skipShortDefs": false,

  "skipFullDefs": false,

  "downloadMorph": true,

  "downloadShortDef": true,

  "downloadFullDef": true,

  "downloadTranslations": true,

  "downloadFailedMorph": true,

  "downloadFailedShortDef": true,

  "downloadFailedFullDef": true,

  "downloadFailedTranslations": true,
  
  "downloadFailedAnything": true
}

