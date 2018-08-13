import { AlpheiosTuftsAdapter } from '../node_modules/alpheios-morph-client/dist/alpheios-morph-client.js'
// import { Constants } from 'alpheios-data-models-node'

import CheckTable from './check-table.js'
import FileController from './file-controller.js'

class DataController {
  constructor (sourceData, configData, params) {
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

    this.resultData = new CheckTable()
    this.tabDelimiter = params.tabDelimiter || '\t'
    this.langs = params.langs || []
    this.skipShortDefs = params.skipShortDefs || false
    this.skipFullDefs = params.skipFullDefs || false

    this.getData()
  }

  async getData () {
    await this.resultData.getData(this) 
    this.downloadMorph()
    if (!this.skipShortDefs) {
      this.downloadShortDef()
    }
    if (!this.skipFullDefs) {
      this.downloadFullDef()
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
}
module.exports = DataController
