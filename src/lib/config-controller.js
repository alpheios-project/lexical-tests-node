class ConfigController {
  constructor (configFile, paramsFile) {
    this.configFile = JSON.parse(configFile)
    this.paramsFile = JSON.parse(paramsFile)
  }

  prepareConfigData () {
    this.languages = this.prepareLanguagesConfig(this.configFile.languages)
    this.dictionaries = this.configFile.dictionaries
    this.translationlangs = this.configFile.translationlangs
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
    this.tabDelimiter = this.checkIfUndefined(this.paramsFile.tabDelimiter, '\t')
    this.langs = this.prepareLangs(this.paramsFile.langs)

    this.skipShortDefs = this.checkIfUndefined(this.paramsFile.skipShortDefs, false)
    this.skipFullDefs = this.checkIfUndefined(this.paramsFile.skipFullDefs, false)

    this.downloadMorphFlag = this.checkIfUndefined(this.paramsFile.downloadMorph, true)
    this.downloadShortDefFlag = this.checkIfUndefined(this.paramsFile.downloadShortDef, true)
    this.downloadFullDefFlag = this.checkIfUndefined(this.paramsFile.downloadFullDef, true)

    this.downloadFailedShortDefFlag = this.checkIfUndefined(this.paramsFile.downloadFailedShortDef, true)
    this.downloadFailedFullDefFlag = this.checkIfUndefined(this.paramsFile.downloadFailedFullDef, true)

    this.downloadTranslationsFlag = this.checkIfUndefined(this.paramsFile.downloadTranslations, true)
    this.downloadFailedTranslationsFlag = this.checkIfUndefined(this.paramsFile.downloadFailedTranslations, true)

    this.downloadFailedAnythingFlag = this.checkIfUndefined(this.paramsFile.downloadFailedAnything, true)
  }

  prepareLangs (langs) {
    return langs.map(lang => { return { code: lang, property: this.configFile.translationlangs[lang] } })
  }

  checkIfUndefined (data, defaultVal) {
    return (typeof data !== 'undefined') ? data : defaultVal
  }
}

module.exports = ConfigController