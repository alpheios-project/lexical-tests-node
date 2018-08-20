/* eslint-env jest */
/* eslint-disable no-unused-vars */

const AlpheiosTuftsAdapter = require('alpheios-morph-client').AlpheiosTuftsAdapter
const Lexicons = require('alpheios-lexicon-client').Lexicons
const LemmaTranslations = require('alpheios-lemma-client').LemmaTranslations
const LMF = require('alpheios-data-models').LanguageModelFactory


class LexicalQuery {
  constructor () {
    this.maAdapter = new AlpheiosTuftsAdapter()
  }

  async getMorphData (dataItem) {
    try {
      let homonym = await this.maAdapter.getHomonym(dataItem.languageID, dataItem.targetWord)
      dataItem.homonym = homonym
    } catch (error) {
      // console.error(`Problems with fetching morph data - ${error.message}`)
      return 'no'
    }
  }

  async prepareShortDefsRequests (dataItem, rowData) {
    let definitionRequests = []

    for (let i = 0; i < rowData.lexiconShortOpts.allow.length; i++) {
      let curOpts = { allow: [ rowData.lexiconShortOpts.allow[i] ], code: rowData.lexiconShortOpts.codes[i], dict: rowData.lexiconShortOpts.dicts[i] }

      for (let lexeme of dataItem.homonym.lexemes) {
        try {
          let requests = await Lexicons.fetchShortDefs(lexeme.lemma, curOpts)
          definitionRequests = definitionRequests.concat(requests.map(request => {
            return {
              request: request,
              type: 'Short definition',
              lexeme: lexeme,
              appendFunction: 'appendShortDefs',
              complete: false,
              dict: curOpts.dict
            }
          }))
        } catch (error) {
          // console.error(`Problems with fetching shortDefsRequests - ${error.message}`)
        }
      }
    }

    rowData.definitionShortRequests = definitionRequests
  }

  async prepareFullDefsRequests (dataItem, rowData) {
    let definitionRequests = []

    for (let i = 0; i < rowData.lexiconFullOpts.allow.length; i++) {
      let curOpts = { allow: [ rowData.lexiconFullOpts.allow[i] ], code: rowData.lexiconFullOpts.codes[i], dict: rowData.lexiconFullOpts.dicts[i] }

      for (let lexeme of dataItem.homonym.lexemes) {
        try {
          let requests = await Lexicons.fetchFullDefs(lexeme.lemma, curOpts)
          definitionRequests = definitionRequests.concat(requests.map(request => {
            return {
              request: request,
              type: 'Full definition',
              lexeme: lexeme,
              appendFunction: 'appendFullDefs',
              complete: false,
              dict: curOpts.dict
            }
          }))
        } catch (error) {
          // console.error(`Problems with fetching fullDefsRequests - ${error.message}`)
        }
      }
    }

    rowData.definitionFullRequests = definitionRequests
  }

  async getDefs (definitionRequests) {
    for (let definitionRequest of definitionRequests) {
      try {
        let definition = await definitionRequest.request
        // console.log(`${definitionRequest.type}(s) received:`, definition)

        definition.forEach(def => { def.dict = definitionRequest.dict })

        definitionRequest.lexeme.meaning[definitionRequest.appendFunction](definition)
      } catch (error) {
        definitionRequest.lexeme.meaning.appendShortDefs({ dict: definitionRequest.dict })
        // console.error(`${definitionRequest.type}(s) request failed: ${error.message}`)
      }
    }
  }

  async getLemmaTranslations (langs, dataItem, rowData) {
    let languageCode = LMF.getLanguageCodeFromId(rowData.languageID)

    for (let lexeme of dataItem.homonym.lexemes) {
      lexeme.lemma.translations = []
      for (let lang of langs) {
        try {
          let resTranslations = await LemmaTranslations.fetchTranslations([ lexeme.lemma ], languageCode, lang)
          lexeme.lemma.translations.push(lexeme.lemma.translation)
        } catch (err) {
          // console.error('Problems with fetching translations for', err.message)
        }
      }
    }
  }
}

module.exports = LexicalQuery