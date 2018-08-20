const AlpheiosTuftsAdapter = require('alpheios-morph-client').AlpheiosTuftsAdapter
const Lexicons = require('alpheios-lexicon-client').Lexicons
const LemmaTranslations = require('alpheios-lemma-client').LemmaTranslations
const LMF = require('alpheios-data-models').LanguageModelFactory

class LexicalQuery {
  constructor (params) {
    this.targetWord = params.targetWord
    this.languageID = params.languageID
    this.languageName = params.languageName

    this.maAdapter = new AlpheiosTuftsAdapter()

    this.lexiconShortOpts = params.lexiconShortOpts
    this.lexiconFullOpts = params.lexiconFullOpts
  }

  async getMorphData () {
    try {
      this.homonym = await this.maAdapter.getHomonym(this.languageID, this.targetWord)
    } catch (error) {
      // console.error(`maAdapter.getHomonym - ${error.message}`)
    }
  }

  async getShortDefsData () {
    let definitionRequests = []

    for (let i = 0; i < this.lexiconShortOpts.allow.length; i++) {
      let curOpts = { allow: [ this.lexiconShortOpts.allow[i] ], code: this.lexiconShortOpts.codes[i], dict: this.lexiconShortOpts.dicts[i] }

      for (let lexeme of this.homonym.lexemes) {
        let requests = Lexicons.fetchShortDefs(lexeme.lemma, curOpts)
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
      }
    }

    for (let definitionRequest of definitionRequests) {
      try {
        let definition = await definitionRequest.request
        // console.log(`${definitionRequest.type}(s) received:`, definition)

        definition.forEach(def => { def.dict = definitionRequest.dict })

        definitionRequest.lexeme.meaning[definitionRequest.appendFunction](definition)
      } catch (error) {
        definitionRequest.lexeme.meaning.appendShortDefs({ dict: definitionRequest.dict })
        // console.error(`${definitionRequest.type}(s) request failed: ${error}`)
      }
    }
  }

  async getFullDefsData () {
    let definitionRequests = []

    for (let i = 0; i < this.lexiconFullOpts.allow.length; i++) {
      let curOpts = { allow: [ this.lexiconFullOpts.allow[i] ], code: this.lexiconFullOpts.codes[i], dict: this.lexiconFullOpts.dicts[i] }

      for (let lexeme of this.homonym.lexemes) {
        let requests = Lexicons.fetchFullDefs(lexeme.lemma, curOpts)
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
      }
    }
    for (let definitionRequest of definitionRequests) {
      try {
        let definition = await definitionRequest.request
        // console.log(`${definitionRequest.type}(s) received:`, definition)

        definition.forEach(def => { def.dict = definitionRequest.dict })

        definitionRequest.lexeme.meaning[definitionRequest.appendFunction](definition)
      } catch (error) {
        definitionRequest.lexeme.meaning.appendFullDefs({ dict: definitionRequest.dict })
        // console.error(`${definitionRequest.type}(s) request failed: ${error}`)
      }
    }
  }

  async getLemmaTranslations (langs) {
    let languageCode = LMF.getLanguageCodeFromId(this.languageID)

    for (let lexeme of this.homonym.lexemes) {
      lexeme.lemma.translations = []
      for (let lang of langs) {
        try {
          let resTranslations = await LemmaTranslations.fetchTranslations([ lexeme.lemma ], languageCode, lang.code)
          lexeme.lemma.translations.push(lexeme.lemma.translation)
        } catch (err) {
          // console.error('Problems with fetching for', lang, err.message)
        }
      }
    }
  }
}

module.exports = LexicalQuery