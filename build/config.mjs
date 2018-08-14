import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    target: "node",
    entry: "./src/index.js",
    output: {
      path: path.resolve(projectRoot, "./dist"),
      filename: "alpheios-lt-cmdtool.js"
    },
    externals: [],
    mode: "development",
    node: {
      __dirname: false
    },
    resolve: {
      modules: ['node_modules']
    }
  }
}

export { webpack }