const FileController = require('./file-controller.js')

class DownloadController {

  static downloadMorph (dc) {
  	if (dc.configC.downloadMorphFlag) {
      dc.resultData.createMorphDataDownload()

      if (dc.resultData.morphData.length > 1) {
        FileController.writeCSVData(dc.resultData.morphData, dc.configC.tabDelimiter, '-morphData.csv')
      } else {
        console.info('There are no data to download morph data')
      }
    }
  }

  static downloadShortDef (dc) {
  	if (!dc.configC.skipShortDefs && dc.configC.downloadShortDefFlag) {
      dc.resultData.createShortDefDownload()
      
      if (dc.resultData.shortDefData.length > 1) {
        FileController.writeCSVData(dc.resultData.shortDefData, dc.configC.tabDelimiter, '-shortDefData.csv')
      } else {
        console.info('There are no data to download short definitions data')
      }

    }
  }

  static downloadFullDef (dc) {
  	if (!dc.configC.skipFullDefs && dc.configC.downloadFullDefFlag) {
      dc.resultData.createFullDefDownload()

      if (Object.keys(dc.resultData.fullDefData).length > 0) {
        for (let tbl in dc.resultData.fullDefData) {
          FileController.writeData(dc.resultData.fullDefData[tbl], `-fullDefData-${tbl}.html`)
        }
      } else {
        console.info('There are no data to download full definitions data')
      }
    }
  }

  static downloadTranslations (dc) {
  	if (dc.configC.downloadTranslationsFlag && dc.configC.langs && dc.configC.langs.length > 0) {
      dc.resultData.createTranslationsDataDownload(dc.configC.langs)

      if (dc.resultData.translationsData.length > 1) {
        FileController.writeCSVData(dc.resultData.translationsData, dc.configC.tabDelimiter, '-translationsData.csv')
      } else {
        console.info('There are no data to download translations data')
      }      
    }
  }

  static downloadFailedMorph (dc) {
  	if (dc.configC.downloadFailedMorphFlag) {
      dc.resultData.createFailedMorphDownload()

      if (dc.resultData.failedMorph.length > 1) {
        FileController.writeCSVData(dc.resultData.failedMorph, dc.configC.tabDelimiter, '-failedMorph.csv')
      } else {
        console.info('There are no data to download failed morph data')
      } 
    }
  }

  static downloadFailedShortDef (dc) {
  	if (dc.configC.downloadFailedShortDefFlag) {
      dc.resultData.createFailedShortDefDownload()

      if (dc.resultData.failedShortDef.length > 1) {
        FileController.writeCSVData(dc.resultData.failedShortDef, dc.configC.tabDelimiter, '-failedShortDef.csv')
      } else {
        console.info('There are no data to download failed short definitions data')
      } 
    }
  }

  static downloadFailedFullDef (dc) {
  	if (dc.configC.downloadFailedFullDefFlag) {
      dc.resultData.createFailedFullDefDownload()

      if (dc.resultData.failedFullDef.length > 1) {
        FileController.writeCSVData(dc.resultData.failedFullDef, dc.configC.tabDelimiter, '-failedFullDef.csv')
      } else {
        console.info('There are no data to download failed full definitions data')
      }
    }
  }

  static downloadFailedTranslations (dc) {
  	if (dc.configC.downloadFailedTranslationsFlag && dc.configC.langs && dc.configC.langs.length > 0) {
      dc.resultData.createFailedTranslationsDownload(dc.configC.langs)

      if (dc.resultData.failedTranslations.length > 1) {
        FileController.writeCSVData(dc.resultData.failedTranslations, dc.configC.tabDelimiter, '-failedTranslations.csv')
      } else {
        console.info('There are no data to download failed translations data')
      }
    }
  }

  static downloadFailedAnything (dc) {
  	if (dc.downloadFailedAnythingFlag) {
      dc.resultData.createFailedAnythingDownload()

      if (dc.resultData.failedAnything.length > 1) {
        FileController.writeCSVData(dc.resultData.failedAnything, dc.tabDelimiter, '-failedAnything.csv')
      } else {
        console.info('There are no data to download any failed data')
      }
    }
  }
}

module.exports = DownloadController