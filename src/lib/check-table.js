const LexicalQuery = require('./lexical-query.js')
const parallel = require('async-await-parallel')
const FileController = require('./file-controller.js')
const models = require('alpheios-data-models')

class CheckTable {
  constructor () {
    this.data = []
    this.counter = 0
    this.logFile = 'results.log'
    FileController.createLogFile(this.logFile)
    this.logOnlyFailures = false
  }

  async getData (sourceData, params) {
    let size = sourceData.data.length
    const res = await parallel(
      sourceData.data.map(dataItem => async () => { await this.getDataWord(dataItem, params, ++this.counter, size) })
      , sourceData.queue_max)
    console.info('finish to collect data')
  }

  async getDataWord (dataItem, params,counter, size) {
    dataItem.index = `${counter}/${size}`
    let start = Date.now()
    let lexQuery = new LexicalQuery()
    let checkpoint = start
    let time
    let rowData = this.initRowData(dataItem, params)
    this.data.push(rowData)
    if (!params.skipMorph) {
      let res1 = await lexQuery.getMorphData(dataItem)
      checkpoint = Date.now()
      time = checkpoint - start
      this.formatMorphData(dataItem, rowData)
      let status = dataItem.morphClient ? true :false
      this.logOutput(dataItem,"morphClient",status,time,this.logOnlyFailures)
    } else {
      let formLexeme = new models.Lexeme(new models.Lemma(dataItem.targetWord, dataItem.languageID), [])
      dataItem.homonym = new models.Homonym([formLexeme], dataItem.targetWord)
    }
    this.initLexemes(dataItem, rowData)

    if (dataItem.homonym && dataItem.homonym.lexemes && rowData.lexiconShortOpts && rowData.lexiconShortOpts.allow && !params.skipShortDefs) {
      dataItem.homonym.lexemes.forEach(lex => { lex.meaning.shortDefs = [] })

      let res2 = await lexQuery.prepareShortDefsRequests(dataItem, rowData)

      if (rowData.definitionShortRequests && rowData.definitionShortRequests.length > 0) {
        let res3 = await lexQuery.getDefs(rowData.definitionShortRequests)
      }

      this.formatShortDefsData(dataItem, rowData)
      let cpt = Date.now()
      time = cpt - checkpoint
      checkpoint = cpt
      let status = dataItem.homonym && dataItem.homonym.shortDefs
      this.logOutput(dataItem,"shortDefs",status,time,this.logOnlyFailures)
    }

    if (dataItem.homonym && dataItem.homonym.lexemes && rowData.lexiconFullOpts && rowData.lexiconFullOpts.allow && !params.skipFullDefs) {
      let res2 = await lexQuery.prepareFullDefsRequests(dataItem, rowData)

      if (rowData.definitionFullRequests && rowData.definitionFullRequests.length > 0) {
        let res3 = await lexQuery.getDefs(rowData.definitionFullRequests)
      }
      this.formatFullDefsData(dataItem, rowData)
      let cpt = Date.now()
      time = cpt - checkpoint
      checkpoint = cpt
      let status = dataItem.homonym && dataItem.homonym.fullDefs
      this.logOutput(dataItem,"fullDefs",status,time,this.logOnlyFailures)
    }

    if (dataItem.homonym && dataItem.homonym.lexemes && params.langs && params.langs.length > 0) {
      let langs = params.langs.map(lang => lang.code)
      let res4 = await lexQuery.getLemmaTranslations(langs, dataItem, rowData)

      this.formatTranslationsData(params.langs, dataItem, rowData)
      let cpt = Date.now()
      time = cpt - checkpoint
      let status = dataItem.homonym && dataItem.homonym.translations
      this.logOutput(dataItem,"translations",status,time)
    }
    let end = Date.now()
    time = end - start
  }

  initRowData (dataItem, params) {
    let rowData = {
      targetWord: dataItem.targetWord,
      languageID: dataItem.languageID,
      languageName: dataItem.languageName,
      lexiconShortOpts: dataItem.lexiconShortOpts,
      lexiconFullOpts: dataItem.lexiconFullOpts,
      skipShortDefs: params.skipShortDefs,
      skipFullDefs: params.skipFullDefs,
      langs: params.langs,
      morphClient: false
    }
    return rowData
  }

  formatMorphData (dataItem, rowData) {
    if (dataItem.homonym && dataItem.homonym.lexemes) {
      rowData.morphClient = true
      dataItem.morphClient = true
    }
  }

  initLexemes(dataItem, rowData) {
    rowData.lexemes = []
    if (dataItem.homonym) {
      dataItem.homonym.lexemes.forEach(lexeme => {
        let lexemeData = { lemmaWord: lexeme.lemma.word, morphData: {} }
        lexemeData.morphData.principalParts = lexeme.lemma.principalParts.join('; ')
        for (let feature in lexeme.lemma.features) {
          lexemeData.morphData[feature] = lexeme.lemma.features[feature].value
        }

        if (lexeme.meaning.shortDefs.length > 0) {
          lexemeData.morphShortDefs = lexeme.meaning.shortDefs.map(def => def.text)
        }
        rowData.lexemes.push(lexemeData)
      })
    }
  }

  formatShortDefsData (dataItem, rowData) {
    dataItem.homonym.lexemes.forEach((lexeme, index) => {
      rowData.lexemes[index].shortDefData = { lexClient: false }
      if (lexeme.meaning.shortDefs && lexeme.meaning.shortDefs.length > 0) {
        dataItem.homonym.shortDefs = lexeme.meaning.shortDefs.filter(d => d && d.text).length > 0
        rowData.lexemes[index].shortDefData.lexClient = dataItem.homonym.shortDefs
        rowData.lexemes[index].shortDefData.shortDefs = lexeme.meaning.shortDefs.map(def => { return { text: def.text, code: def.code, dict: def.dict } })
      }
    })
  }

  formatFullDefsData (dataItem, rowData) {
    dataItem.homonym.lexemes.forEach((lexeme, index) => {
      rowData.lexemes[index].fullDefData = { lexClient: false }
      if (lexeme.meaning.fullDefs && lexeme.meaning.fullDefs.length > 0) {
        dataItem.homonym.fullDefs = lexeme.meaning.fullDefs.filter(d => d && d.text).length > 0
        rowData.lexemes[index].fullDefData.lexClient = dataItem.homonym.fullDefs
        rowData.lexemes[index].fullDefData.fullDefs = lexeme.meaning.fullDefs.map(def => { return { text: def.text, code: def.code, dict: def.dict } })
      }
    })
  }

  formatTranslationsData (langs, dataItem, rowData) {
    dataItem.homonym.lexemes.forEach((lexeme, index) => {
      rowData.lexemes[index].translations = {}
      for (let lang of langs) {
        let curTrans = lexeme.lemma.translations.filter(trans => trans.languageCode === lang.property)

        if (curTrans.length === 0) {
          dataItem.homonym.translations = true
          rowData.lexemes[index].translations[lang.property] = { languageCode: lang.property }
        } else {
          rowData.lexemes[index].translations[lang.property] = curTrans[0]
        }
      }
    })
  }

  clearUnprinted(str) {
    return str ? str.replace(/\r/g, ' ').replace(/\n/g, ' ') : null
  }



  getFeaturesList () {
    let featuresList = []
    this.data.forEach(homonym => {
      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          for (let feature in lexeme.morphData) {
            if (featuresList.indexOf(feature) === -1) { featuresList.push(feature) }
          }
        })
      }
    })
    return featuresList
  }

  createMorphDataDownload () {
    let table = []
    let featuresList = this.getFeaturesList()

    let header = ['TargetWord', 'Language', 'MorphClient', 'LemmaWord']
    header = header.concat(featuresList)
    header.push('MorphShortDef')
    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName
      let hasMorphData = homonym.morphClient ? 'yes' : 'no'

      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          let row = []
          row.push(targetWord, langCode, hasMorphData)
          row.push(lexeme.lemmaWord)

          for (let feature of featuresList) {
            row.push(lexeme.morphData[feature])
          }

          let defs = lexeme.morphShortDefs ? lexeme.morphShortDefs.map((item, index) => (lexeme.morphShortDefs.length > 1 ? ((index + 1) + '. ') : '') + item).join('; ') : 'no'
          row.push(defs)
          table.push(row)
        })
      } else {
        let row = []
        row.push(targetWord, langCode, hasMorphData)
        table.push(row)
      }
    })

    this.morphData = table
  }

  getDictsList (subArr1, subArr2) {
    let dictsList = []

    this.data.forEach(homonym => {
      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          if (lexeme[subArr1] && lexeme[subArr1][subArr2]) {
            lexeme[subArr1][subArr2].forEach(def => {
              if (dictsList.indexOf(def.dict) === -1) {
                dictsList.push(def.dict)
              }
            })
          }
        })
      }
    })

    return dictsList
  }

  createShortDefDownload () {
    let table = []

    let dictsList = this.getDictsList('shortDefData', 'shortDefs')

    let header = ['TargetWord', 'Language', 'LexClient', 'LemmaWord']
    header = header.concat(dictsList)
    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName

      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          let row = []
          row.push(targetWord)
          row.push(langCode)
          row.push(lexeme.shortDefData && lexeme.shortDefData.lexClient ? 'yes' : 'no')
          row.push(lexeme.lemmaWord)

          if (lexeme.shortDefData && lexeme.shortDefData.shortDefs) {
            dictsList.forEach(dict => {
              let dictValue = []
              lexeme.shortDefData.shortDefs.forEach(def => {
                if (def.dict === dict) { dictValue.push(def.text ? def.text : 'no') }
              })
              row.push(dictValue.length > 0 ? dictValue.map((item, index) => (dictValue.length > 1 ? (index + 1) + '. ' : '') + item).join('; ') : null)
            })
            table.push(row)
          }
        })
      } else {
        let row = []
        row.push(targetWord)
        row.push(langCode)
        row.push('no')
        table.push(row)
      }
    })

    this.shortDefData = table
  }

  createFullDefDownload () {
    let dictsList = this.getDictsList('fullDefData', 'fullDefs')
    let dictsTables = {}

    for (let dict of dictsList) {
      let table = ''
      let allWords = ''
      this.data.forEach(homonym => {
        let checkDict = homonym.lexemes ? homonym.lexemes.some(lexeme => lexeme.fullDefData && lexeme.fullDefData.fullDefs.some(def => def.dict === dict)) : false

        if (checkDict) {
          allWords = allWords + `<li><a href="#${homonym.targetWord}">${homonym.targetWord}</a></li>`
          table = table + `<h1 id="${homonym.targetWord}">${homonym.targetWord} - ${homonym.languageName}</h1>`

          if (homonym.lexemes) {
            homonym.lexemes.forEach((lexeme, index) => {
              let curIndex = homonym.lexemes.length > 1 ? (index + 1) + '. ' : ''
              table = table + `<h2>${curIndex}${lexeme.lemmaWord}</h2>`
              if (lexeme.fullDefData.fullDefs) {
                lexeme.fullDefData.fullDefs.filter(fullDef => fullDef.dict === dict).forEach(fullDef => { table = table + (fullDef.text ? fullDef.text : 'No data') })
              }
            })
          } else {
            table = table + `<h2>No data</h2>`
          }
          table = table + `<p><a href="#content">to start</a></p>`
        }
      })

      table = '<!doctype html><html><head></head><body><ol id="content">' + allWords + '</ol>' + table + '</body></html>'
      dictsTables[dict] = table
    }

    this.fullDefData = dictsTables
  }

  createTranslationsDataDownload (langsS) {
    let table = []
    if (langsS && langsS.length > 0) {
      let langs = langsS.map(lang => lang.property)

      let header = ['TargetWord', 'Language', 'Lemma', ...langs]

      table.push(header)

      this.data.forEach(homonym => {
        let targetWord = homonym.targetWord
        let langCode = homonym.languageName

        if (homonym.lexemes) {
          homonym.lexemes.forEach(lexeme => {
            let langsData = []
            let lemma = lexeme.lemmaWord
            for (let lang of langs) {
              if (lexeme.translations[lang].glosses) {
                langsData.push(lexeme.translations[lang].glosses.join('; '))
              }
            }
            table.push([targetWord, langCode, lemma, ...langsData])
          })
        }
      })
    } else {
      table.push(['TargetWord', 'Language', 'Lemma'])
    }
    this.translationsData = table
  }

  createFailedMorphDownload () {
    let table = []
    let header = ['TargetWord', 'Language', 'MorphClient']
    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName
      let hasMorphData = homonym.morphClient ? 'yes' : 'no'

      if (!homonym.morphClient) {
        table.push([targetWord, langCode, hasMorphData])
      }
    })

    this.failedMorph = table
  }

  createFailedShortDefDownload () {
    let table = []

    let dictsList = this.getDictsList('shortDefData', 'shortDefs')

    let header = ['TargetWord', 'Language', 'LexClient', 'LemmaWord']
    header = header.concat(dictsList)
    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName

      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          let row = []
          row.push(targetWord)
          row.push(langCode)
          row.push(lexeme.shortDefData && lexeme.shortDefData.lexClient ? 'yes' : 'no')
          row.push(lexeme.lemmaWord)

          if (lexeme.shortDefData && lexeme.shortDefData.shortDefs) {
            dictsList.forEach(dict => {
              let dictValue = []
              lexeme.shortDefData.shortDefs.forEach(def => {
                if (def.dict === dict && !def.text) { dictValue.push('no') }
              })
              if (dictValue.length > 0) {
                row.push(dictValue.length > 0 ? dictValue.map((item, index) => (dictValue.length > 1 ? (index + 1) + '. ' : '') + item).join('; ') : null)
              }
            })
          }
          if (row.length > 4) {
            table.push(row)
          }
        })
      } else {
        let row = []
        row.push(targetWord)
        row.push(langCode)
        row.push('no')
        table.push(row)
      }
    })

    this.failedShortDef = table
  }

  createFailedFullDefDownload () {
    let table = []

    let dictsList = this.getDictsList('fullDefData', 'fullDefs')

    let header = ['TargetWord', 'Language', 'LexClient', 'LemmaWord']
    header = header.concat(dictsList)
    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName

      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          let row = []
          row.push(targetWord)
          row.push(langCode)
          row.push(lexeme.fullDefData && lexeme.fullDefData.lexClient ? 'yes' : 'no')
          row.push(lexeme.lemmaWord)

          if (lexeme.fullDefData && lexeme.fullDefData.shortDefs) {
            dictsList.forEach(dict => {
              let dictValue = []
              lexeme.fullDefData.shortDefs.forEach(def => {
                if (def.dict === dict && !def.text) { dictValue.push('no') }
              })
              if (dictValue.length > 0) {
                row.push(dictValue.map((item, index) => (dictValue.length > 1 ? (index + 1) + '. ' : '') + item).join('; '))
              }
            })
          }
          if (row.length > 4) {
            table.push(row)
          }
        })
      } else {
        let row = []
        row.push(targetWord)
        row.push(langCode)
        row.push('no')
        table.push(row)
      }
    })

    this.failedFullDef = table
  }

  createFailedTranslationsDownload (langsS) {
    let langs = langsS.map(lang => lang.property)

    let table = []
    let header = ['TargetWord', 'Language', 'Lemma', ...langs]

    table.push(header)

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName

      if (homonym.lexemes) {
        homonym.lexemes.forEach(lexeme => {
          let langsData = []
          let lemma = lexeme.lemmaWord
          for (let lang of langs) {
            if (!lexeme.translations[lang].glosses) {
              langsData.push('no')
            } else {
              langsData.push(null)
            }
          }
          if (langsData.filter(val => val === 'no').length > 0) {
            table.push([targetWord, langCode, lemma, ...langsData])
          }
        })
      }
    })
    this.failedTranslations = table
  }

  createFailedAnythingDownload () {
    let table = []
    let header = ['TargetWord', 'Language', 'MorphClient', 'LemmaWord', 'ShortLexical', 'FullLexical']
    table.push(header)

    let dictsListShort = this.getDictsList('shortDefData', 'shortDefs')
    let dictsListFull = this.getDictsList('fullDefData', 'fullDefs')

    this.data.forEach(homonym => {
      let targetWord = homonym.targetWord
      let langCode = homonym.languageName
      let hasMorphData = homonym.morphClient ? 'yes' : 'no'

      if (!homonym.morphClient) {
        table.push([targetWord, langCode, hasMorphData])
      } else {
        homonym.lexemes.forEach(lexeme => {
          let shortDefsResult = []
          let fullDefsResult = []

          if ((lexeme.shortDefData && lexeme.shortDefData.shortDefs) || (lexeme.fullDefData && lexeme.fullDefData.fullDefs)) {
            dictsListShort.forEach(dict => {
              let dictValue = []
              if (lexeme.shortDefData && lexeme.shortDefData.shortDefs) {
                lexeme.shortDefData.shortDefs.forEach(def => {
                  if (def.dict === dict && !def.text) { shortDefsResult.push(dict + ' - no') }
                })
              }
              if (lexeme.fullDefData && lexeme.fullDefData.fullDefs) {
                lexeme.fullDefData.fullDefs.forEach(def => {
                  if (def.dict === dict && !def.text) { fullDefsResult.push(dict + ' - no') }
                })
              }
            })
          }

          if (shortDefsResult.length > 0 || fullDefsResult.length > 0) {
            table.push([targetWord, langCode, hasMorphData, lexeme.lemmaWord, shortDefsResult.join(', '), fullDefsResult.join(', ')])
          }
        })
      }
    })

    this.failedAnything = table
  }

  logOutput(dataItem,queryType,status,time,failuresOnly=true) {
    if (! failuresOnly || ! status) {
      let message = `${dataItem.index},${dataItem.targetWord},${queryType}:${status},${time}`
      FileController.appendLogData(message,this.logFile)
      console.error(message)
    }
  }
}

module.exports = CheckTable