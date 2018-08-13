import { AlpheiosTuftsAdapter } from '../node_modules/alpheios-morph-client/dist/alpheios-morph-client.js'
// import { Constants } from 'alpheios-data-models-node'

import CheckTable from './check-table.js'
import FileController from './file-controller.js'

class DataController {
  constructor (sourceData, configData, paramsFile) {
  	try {
      this.sourceData = JSON.parse(sourceData)
      this.configData = JSON.parse(configData)

      console.log('3 JSON files are parsed')
    } catch (err) {
      console.error('Some problems with parsing json files:', err.message)
    }

    this.prepareConfigData()
    this.prepareSourceData()

    console.log('4 Sorce data and config data are prepared')

    let paramsData = JSON.parse(paramsFile)

    this.resultData = new CheckTable()

    this.tabDelimiter = paramsData.tabDelimiter || '\t'

    this.langs = this.prepareLangs(paramsData.langs)

    this.skipShortDefs = paramsData.skipShortDefs
    this.skipFullDefs = paramsData.skipFullDefs

    this.downloadMorphFlag = paramsData.downloadMorph
    this.downloadShortDefFlag = paramsData.downloadShortDef
    this.downloadFullDefFlag = paramsData.downloadFullDef

    this.downloadFailedShortDefFlag = paramsData.downloadFailedShortDef
    this.downloadFailedFullDefFlag = paramsData.downloadFailedFullDef

    this.downloadTranslationsFlag = paramsData.downloadTranslations
    this.downloadFailedTranslationsFlag = paramsData.downloadFailedTranslations

    this.downloadFailedAnythingFlag = paramsData.downloadFailedAnything

    this.getData()
  }

  async getData () {
    await this.resultData.getData(this) 
    
    if (this.downloadMorphFlag) {
      this.downloadMorph()
    }

    if (!this.skipShortDefs && this.downloadShortDefFlag) {
      this.downloadShortDef()
    }

    if (!this.skipFullDefs && this.downloadFullDefFlag) {
      this.downloadFullDef()
    }

    if (this.downloadTranslationsFlag) {
      this.downloadTranslations()
    }

    if (this.downloadFailedMorphFlag) {
      this.downloadFailedMorph()
    }

    if (this.downloadFailedShortDefFlag) {
      this.downloadFailedShortDef()
    }

    if (this.downloadFailedFullDefFlag) {
      this.downloadFailedFullDef()
    }

    if (this.downloadFailedTranslationsFlag) {
      this.downloadFailedTranslations()
    }

    if (this.downloadFailedAnythingFlag) {
      this.downloadFailedAnything()
    }
  }

  prepareConfigData () {
  	this.languages = this.prepareLanguagesConfig(this.configData.languages)
    this.dictionaries = this.configData.dictionaries
    this.translationlangs = this.configData.translationlangs
  }

  prepareLanguagesConfig (languagesRaw) {
    let langRes = {}
    for (let lang in languagesRaw) {
      langRes[lang] = {
        const: languagesRaw[lang],
        name: languagesRaw[lang]
      }
    }
    return langRes
  }

  prepareSourceData () {
    this.sourceData.forEach(dataItem => {
      dataItem.languageID = Symbol.for(this.languages[dataItem.languageCode].const)
      dataItem.languageName = this.languages[dataItem.languageCode].name
      this.prepareLexicalConfigs(dataItem.lexiconShortOpts, dataItem.languageCode)
      this.prepareLexicalConfigs(dataItem.lexiconFullOpts, dataItem.languageCode)
    })
    this.sourceData.sort(function (a, b) { return a.languageCode < b.languageCode })
    
  }

  prepareLexicalConfigs (defOpts, languageCode) {
    if (defOpts) {
      if (!defOpts.codes) { defOpts.codes = [] }
      if (defOpts.codes.length === 0) {
        defOpts.codes = Object.keys(this.dictionaries).filter(key => this.dictionaries[key].languageCode === languageCode)
      }

      defOpts.allow = defOpts.codes.map(code => this.dictionaries[code].url)
      defOpts.dicts = defOpts.codes.map(code => `${code} (${this.dictionaries[code].name})`)
    }
  }

  prepareLangs (langs) {
    return langs.map(lang => { return { code: lang, property: this.configData.translationlangs[lang] } })
  }

  downloadMorph () {
    this.resultData.createMorphDataDownload()
    FileController.writeCSVData(this.resultData.morphData, this.tabDelimiter, '-morphData.csv')
  }

  downloadShortDef () {
    this.resultData.createShortDefDownload()
    FileController.writeCSVData(this.resultData.shortDefData, this.tabDelimiter, '-shortDefData.csv')
  }

  downloadFullDef () {
    this.resultData.createFullDefDownload()

    for (let tbl in this.resultData.fullDefData) {
      FileController.writeData(this.resultData.fullDefData[tbl], `-fullDefData-${tbl}.html`)
    }
  }

  downloadTranslations () {
    this.resultData.createTranslationsDataDownload()

    FileController.writeCSVData(this.resultData.translationsData, this.tabDelimiter, '-translationsData.csv')
  }

  downloadFailedMorph () {
    this.resultData.createFailedMorphDownload()
    FileController.writeCSVData(this.resultData.failedMorph, this.tabDelimiter, '-failedMorph.csv')
  }

  downloadFailedShortDef () {
    this.resultData.createFailedShortDefDownload()
    FileController.writeCSVData(this.resultData.failedShortDef, this.tabDelimiter, '-failedShortDef.csv')
  }

  downloadFailedFullDef () {
    this.resultData.createFailedFullDefDownload()
    FileController.writeCSVData(this.resultData.failedFullDef, this.tabDelimiter, '-failedFullDef.csv')
  }

  downloadFailedTranslations () {
    this.resultData.createFailedTranslationsDownload()
    FileController.writeCSVData(this.resultData.failedTranslations, this.tabDelimiter, '-failedTranslations.csv')
  }

  downloadFailedAnything () {
    this.resultData.createFailedAnythingDownload()
    FileController.writeCSVData(this.resultData.failedAnything, this.tabDelimiter, '-failedAnything.csv')
  }
}
module.exports = DataController
