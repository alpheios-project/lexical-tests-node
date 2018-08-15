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
    }
  },
  production: {
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.node.min.js'),
        'alpheios-morph-client': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.node.min.js'),
        'alpheios-lexicon-client': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.node.min.js'),
        'alpheios-lemma-client': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.node.min.js')
      }
    }
  },
  development: {
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.node.js'),
        'alpheios-morph-client': path.join(projectRoot, 'node_modules/alpheios-morph-client/dist/alpheios-morph-client.node.js'),
        'alpheios-lexicon-client': path.join(projectRoot, 'node_modules/alpheios-lexicon-client/dist/alpheios-lexicon-client.node.js'),
        'alpheios-lemma-client': path.join(projectRoot, 'node_modules/alpheios-lemma-client/dist/alpheios-lemma-client.node.js')
      }
    }
  }
}

export { webpack }