require('babel-register')({
    presets: [ "env" ]
})
require("babel-polyfill")

const DataController = require('./lib/data-controller.js')

const fs = require('fs')
const path = require('path')

let outputFN = path.join(__dirname, 'result/test.csv')

let readFile = function readFile (filePath) {
  'use strict'
  return fs.readFileSync(filePath, 'utf8')
}

let writeData = function writeData (data, filePath) {
  'use strict'
  fs.writeFileSync(filePath, data, {encoding: 'utf8'})
}

let dataFile = process.argv[2] || 'data.json'
let configFile = process.argv[3] || 'config.json'

if (!dataFile) {
  console.log('You should provide a filename with words for checking data')
} else {
  try {
    let sourceData = readFile(path.join(__dirname, dataFile))
    console.log('1 Source data is uploaded')

    let configData = readFile(path.join(__dirname, configFile))
    console.log('2 Config data is uploaded')

    let dc = new DataController(sourceData, configData)

    // writeData('testMessage1, testMessage2', outputFN)
  } catch (err1) {
    console.error('Some error occurred', err1.stack)
  }
}
