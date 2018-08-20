const FileController = require('./lib/file-controller.js')
const DataController = require('./lib/data-controller.js')

const dataFile = process.argv[2] || 'data.json'
const paramsFile = process.argv[3] || 'params.json'
const configFile = process.argv[4] || 'config.json'

if (!dataFile) {
  console.log('You should provide a filename with words for checking data')
} else {
  try {
    let sourceData = FileController.readData(dataFile)
    console.log('1 Source data is uploaded')

    let configData = FileController.readData(configFile)
    console.log('2 Config data is uploaded')

    let paramsData = FileController.readData(paramsFile)
    console.log('3 Params data is uploaded')

    new DataController(sourceData, configData, paramsData)

  } catch (err1) {
    console.error('Some error occurred', err1.stack)
  }
}