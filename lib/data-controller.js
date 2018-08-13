import { AlpheiosTuftsAdapter } from '../node_modules/alpheios-morph-client/dist/alpheios-morph-client.js'
// import { Constants } from 'alpheios-data-models-node'

class DataController {
  constructor (sourceData, configData) {
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

    this.getMorphData()
    
  }

  async getMorphData () {
    const maAdapter = new AlpheiosTuftsAdapter()
    let homonym = await maAdapter.getHomonym(Symbol.for(this.sourceData[0].languageID), this.sourceData[0].targetWord)
    console.info('****************homonym', homonym)
  }

  prepareConfigData () {
  	this.languages = this.prepareLanguagesConfig(this.configData.languages)
    this.dictionaries = this.configData.dictionaries
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
      dataItem.languageID = this.languages[dataItem.languageCode].const
      dataItem.languageName = this.languages[dataItem.languageCode].name
      this.prepareLexicalConfigs(dataItem.lexiconShortOpts, dataItem.languageCode)
      this.prepareLexicalConfigs(dataItem.lexiconFullOpts, dataItem.languageCode)
    })
    this.sourceData.sort(function (a, b) { return a.languageCode < b.languageCode })
    
  }

  prepareLexicalConfigs (defOpts, languageCode) {
    if (!defOpts.codes) { defOpts.codes = [] }
    if (defOpts.codes.length === 0) {
      defOpts.codes = Object.keys(this.dictionaries).filter(key => this.dictionaries[key].languageCode === languageCode)
    }

    defOpts.allow = defOpts.codes.map(code => this.dictionaries[code].url)
    defOpts.dicts = defOpts.codes.map(code => `${code} (${this.dictionaries[code].name})`)
  }
}
module.exports = DataController
