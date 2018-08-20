const FileController = require('./file-controller.js')

class DownloadController {

  static downloadMorph (dc) {
  	if (dc.configC.downloadMorphFlag) {
      dc.resultData.createMorphDataDownload()
      FileController.writeCSVData(dc.resultData.morphData, dc.configC.tabDelimiter, '-morphData.csv')
    }
  }

  static downloadShortDef (dc) {
  	if (!dc.configC.skipShortDefs && dc.configC.downloadShortDefFlag) {
      dc.resultData.createShortDefDownload()
      FileController.writeCSVData(dc.resultData.shortDefData, dc.configC.tabDelimiter, '-shortDefData.csv')
    }
  }

  static downloadFullDef (dc) {
  	if (!dc.configC.skipFullDefs && dc.configC.downloadFullDefFlag) {
      dc.resultData.createFullDefDownload()

      for (let tbl in dc.resultData.fullDefData) {
        FileController.writeData(dc.resultData.fullDefData[tbl], `-fullDefData-${tbl}.html`)
      }
    }
  }

  static downloadTranslations (dc) {
  	if (dc.configC.downloadTranslationsFlag && dc.configC.langs) {
      dc.resultData.createTranslationsDataDownload(dc.configC.langs)
      FileController.writeCSVData(dc.resultData.translationsData, dc.configC.tabDelimiter, '-translationsData.csv')
    }
  }

  static downloadFailedMorph (dc) {
  	if (dc.configC.downloadFailedMorphFlag) {
      dc.resultData.createFailedMorphDownload()
      FileController.writeCSVData(dc.resultData.failedMorph, dc.configC.tabDelimiter, '-failedMorph.csv')
    }
  }

  static downloadFailedShortDef (dc) {
  	if (dc.configC.downloadFailedShortDefFlag) {
      dc.resultData.createFailedShortDefDownload()
      FileController.writeCSVData(dc.resultData.failedShortDef, dc.configC.tabDelimiter, '-failedShortDef.csv')
    }
  }

  static downloadFailedFullDef (dc) {
  	if (dc.configC.downloadFailedFullDefFlag) {
      dc.resultData.createFailedFullDefDownload()
      FileController.writeCSVData(dc.resultData.failedFullDef, dc.configC.tabDelimiter, '-failedFullDef.csv')
    }
  }

  static downloadFailedTranslations (dc) {
  	if (dc.configC.downloadFailedTranslationsFlag && dc.configC.langs) {
      dc.resultData.createFailedTranslationsDownload(dc.configC.langs)
      FileController.writeCSVData(dc.resultData.failedTranslations, dc.configC.tabDelimiter, '-failedTranslations.csv')
    }
  }

  static downloadFailedAnything (dc) {
  	if (dc.downloadFailedAnythingFlag) {
      dc.resultData.createFailedAnythingDownload()
      FileController.writeCSVData(dc.resultData.failedAnything, dc.tabDelimiter, '-failedAnything.csv')
    }
  }
}

module.exports = DownloadController