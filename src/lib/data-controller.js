const CheckTable = require('./check-table.js')
const DownloadController = require('./download-controller.js')

class DataController {
  constructor (sourceFile, configFIle, paramsFile) {
  	try {
      this.sourceData = JSON.parse(sourceFile)
      this.configData = JSON.parse(configFIle)
      this.paramsData = JSON.parse(paramsFile)

      console.log('4 JSON files are parsed')
    } catch (err) {
      console.error('Some problems with parsing json files:', err.message)
    }

    this.prepareConfigData()
    this.prepareSourceData()
    this.prepareParamsData()

    this.resultData = new CheckTable()

    this.getData()
  }

  async getData () {
  	await this.resultData.getData(this) 

  	this.downloadData()
  }

  downloadData () {
    DownloadController.downloadMorph(this)
    DownloadController.downloadShortDef(this)
    DownloadController.downloadFullDef(this)
    DownloadController.downloadTranslations(this)

    DownloadController.downloadFailedMorph(this)
    DownloadController.downloadFailedShortDef(this)
    DownloadController.downloadFailedFullDef(this)
    DownloadController.downloadFailedTranslations(this)
    DownloadController.downloadFailedAnything(this)
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

  prepareParamsData () {
  	this.tabDelimiter = this.checkIfUndefined(this.paramsData.tabDelimiter, '\t')
  	this.langs = this.prepareLangs(this.paramsData.langs)

    this.skipShortDefs = this.checkIfUndefined(this.paramsData.skipShortDefs, false)
    this.skipFullDefs = this.checkIfUndefined(this.paramsData.skipFullDefs, false)

    this.downloadMorphFlag = this.checkIfUndefined(this.paramsData.downloadMorph, true)
    this.downloadShortDefFlag = this.checkIfUndefined(this.paramsData.downloadShortDef, true)
    this.downloadFullDefFlag = this.checkIfUndefined(this.paramsData.downloadFullDef, true)

    this.downloadFailedShortDefFlag = this.checkIfUndefined(this.paramsData.downloadFailedShortDef, true)
    this.downloadFailedFullDefFlag = this.checkIfUndefined(this.paramsData.downloadFailedFullDef, true)

    this.downloadTranslationsFlag = this.checkIfUndefined(this.paramsData.downloadTranslations, true)
    this.downloadFailedTranslationsFlag = this.checkIfUndefined(this.paramsData.downloadFailedTranslations, true)

    this.downloadFailedAnythingFlag = this.checkIfUndefined(this.paramsData.downloadFailedAnything, true)
  }

  prepareLangs (langs) {
    return langs.map(lang => { return { code: lang, property: this.configData.translationlangs[lang] } })
  }

  checkIfUndefined (data, defaultVal) {
  	return (typeof data !== 'undefined') ? data : defaultVal
  }
}

module.exports = DataController