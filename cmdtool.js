require('babel-register')({
    presets: [ "env" ]
})
require("babel-polyfill")

const DataController = require('./lib/data-controller.js')
const FileController = require('./lib/file-controller.js').default

let paramsFile = process.argv[2] || 'params.json'
let dataFile = process.argv[3] || 'data.json'
let configFile = process.argv[4] || 'config.json'

if (!dataFile) {
  console.log('You should provide a filename with words for checking data')
} else {
  try {
    let sourceData = FileController.readData(dataFile)
    console.log('1 Source data is uploaded')

    let configData = FileController.readData(configFile)
    console.log('2 Config data is uploaded')

    let paramsData = FileController.readData(paramsFile)
    new DataController(sourceData, configData, paramsData)

  } catch (err1) {
    console.error('Some error occurred', err1.stack)
  }
}
