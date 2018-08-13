const fs = require('fs')
const path = require('path')

const csvParser = require('papaparse')

let writeFile = function writeData (data, filePath) {
  'use strict'
  fs.writeFileSync(filePath, '\ufeff' + data, {encoding: 'utf8'})
}

let readFile = function readFile (filePath) {
  'use strict'
  return fs.readFileSync(filePath, 'utf8')
}


export default class FileController {
  static getPrintData () {
    let dt = new Date()
    return dt.toLocaleString('en-GB').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '')
  }

  static writeData (data, filename) {
  	let printDt = FileController.getPrintData()
  	let outputFN = path.join(__dirname, '/../results/'+printDt + filename)

  	writeFile(data, outputFN)
  }

  static writeCSVData (data, tabDelimiter, filename) {
  	FileController.writeData(csvParser.unparse(data, {delimiter: tabDelimiter, newline: '\r\n', encoding: "utf8"}), filename)
  }

  static readData (filename) {
  	let inputFN = path.join(__dirname, '/../' + filename)
  	return readFile(inputFN)
  }
}