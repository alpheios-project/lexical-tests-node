const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const moment = require('moment')

const csvParser = require('papaparse')

const processDir = (process.execPath.search(/node.[a-z]+$/g) == -1) ? path.dirname(process.execPath) : __dirname

let writeFile = function writeData (data, filePath) {
  'use strict'
  fs.writeFileSync(filePath, '\ufeff' + data, {encoding: 'utf8'})
}

let readFile = function readFile (filePath) {
  'use strict'
  return fs.readFileSync(filePath, 'utf8')
}

class FileController {
  static readData (filename) {
    let inputFN = path.join(processDir, filename)
  	return readFile(inputFN)
  }

  static getPrintData () {
    let dt = moment(new Date())
    return dt.format('DD-MM-YYYY_HH-mm-ss')
  }

  static writeData (data, filename) {
    FileController.checkFolder(path.join(processDir, '/results'))

  	let printDt = FileController.getPrintData()
  	let outputFN = path.join(processDir, '/results/'+printDt + filename)

  	writeFile(data, outputFN)
  }

  static writeCSVData (data, tabDelimiter, filename) {
  	FileController.writeData(csvParser.unparse(data, {delimiter: tabDelimiter, newline: '\r\n', encoding: "utf8"}), filename)
  }

  static checkFolder (folderPath) {
    mkdirp(folderPath, function (err) {
      if (err) console.error(err)
    })
  }
}

module.exports = FileController