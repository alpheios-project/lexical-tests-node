const FileController = require('./file-controller.js')

class DownloadController {

  static downloadMorph (dc) {
  	if (dc.downloadMorphFlag) {
      dc.resultData.createMorphDataDownload()
      FileController.writeCSVData(dc.resultData.morphData, dc.tabDelimiter, '-morphData.csv')
    }
  }

  static downloadShortDef (dc) {
  	if (!dc.skipShortDefs && dc.downloadShortDefFlag) {
      dc.resultData.createShortDefDownload()
      FileController.writeCSVData(dc.resultData.shortDefData, dc.tabDelimiter, '-shortDefData.csv')
    }
  }

  static downloadFullDef (dc) {
  	if (!dc.skipFullDefs && dc.downloadFullDefFlag) {
      dc.resultData.createFullDefDownload()

      for (let tbl in dc.resultData.fullDefData) {
        FileController.writeData(dc.resultData.fullDefData[tbl], `-fullDefData-${tbl}.html`)
      }
    }
  }

  static downloadTranslations (dc) {
  	if (dc.downloadTranslationsFlag) {
      dc.resultData.createTranslationsDataDownload()
      FileController.writeCSVData(dc.resultData.translationsData, dc.tabDelimiter, '-translationsData.csv')
    }
  }

  static downloadFailedMorph (dc) {
  	if (dc.downloadFailedMorphFlag) {
      dc.resultData.createFailedMorphDownload()
      FileController.writeCSVData(dc.resultData.failedMorph, dc.tabDelimiter, '-failedMorph.csv')
    }
  }

  static downloadFailedShortDef (dc) {
  	if (dc.downloadFailedShortDefFlag) {
      dc.resultData.createFailedShortDefDownload()
      FileController.writeCSVData(dc.resultData.failedShortDef, dc.tabDelimiter, '-failedShortDef.csv')
    }
  }

  static downloadFailedFullDef (dc) {
  	if (dc.downloadFailedFullDefFlag) {
      dc.resultData.createFailedFullDefDownload()
      FileController.writeCSVData(dc.resultData.failedFullDef, dc.tabDelimiter, '-failedFullDef.csv')
    }
  }

  static downloadFailedTranslations (dc) {
  	if (dc.downloadFailedTranslationsFlag) {
      dc.resultData.createFailedTranslationsDownload()
      FileController.writeCSVData(dc.resultData.failedTranslations, dc.tabDelimiter, '-failedTranslations.csv')
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