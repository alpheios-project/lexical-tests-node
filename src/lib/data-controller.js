const CheckTable = require('./check-table.js')
const DownloadController = require('./download-controller.js')
const ConfigController = require('./config-controller.js')

class DataController {
  constructor (sourceFile, configFile, paramsFile) {
  	try {
      this.sourceData = JSON.parse(sourceFile)
      this.configC = new ConfigController(configFile, paramsFile)

      console.log('4 JSON files are parsed')
    } catch (err) {
      console.error('Some problems with parsing json files:', err.message)
    }

    this.configC.prepareConfigData()
    this.configC.prepareParamsData()

    this.defaultQueueMax = 2

    if (this.checkSourceData()) {
      this.prepareSourceData()

      this.resultData = new CheckTable()

      this.getData()
    }
  }

  async getData () {
  	await this.resultData.getData(this.sourceData, this.configC) 

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

  checkSourceData () {
    if (!Array.isArray(this.sourceData) && (typeof this.sourceData !== 'object') && (typeof this.sourceData === 'object' && !this.sourceData.data)) {
      this.uploadError = 'File should contain an array of words or an object with property data, that contains an array of words.'
      this.sourceData = null
      return false
    }

    if (Array.isArray(this.sourceData)) {
      this.sourceData = { data: this.sourceData.slice(0) }
    }

    if (this.sourceData.data.some(word => !word.targetWord)) {
      this.uploadError = 'Each word block in the file should contain targetWord property, you should reload data.'
      this.sourceData = null
      return false
    }
    if (this.sourceData.data.some(word => !word.languageCode)) {
      this.uploadError = 'Each word block in the file should contain languageCode property, you should reload data.'
      this.sourceData = null
      return false
    }

    this.sourceData.data.forEach(word => {
      if (word.lexiconShortOpts && !word.lexiconShortOpts.codes) {
        word.lexiconShortOpts = { codes: [] }
      }
      if (word.lexiconFullOpts && !word.lexiconFullOpts.codes) {
        word.lexiconFullOpts = { codes: [] }
      }
    })

    this.sourceData.queue_max = this.sourceData.queue_max ? parseInt(this.sourceData.queue_max) : this.defaultQueueMax
    return true
  }

  prepareSourceData () {
    this.sourceData.data.forEach(dataItem => {
      dataItem.languageID = Symbol.for(this.configC.languages[dataItem.languageCode].const)
      dataItem.languageName = this.configC.languages[dataItem.languageCode].name
      this.configC.prepareLexicalConfigs(dataItem.lexiconShortOpts, dataItem.languageCode)
      this.configC.prepareLexicalConfigs(dataItem.lexiconFullOpts, dataItem.languageCode)
    })
    this.sourceData.data.sort(function (a, b) { return a.languageCode < b.languageCode })
    
  }
}

module.exports = DataController