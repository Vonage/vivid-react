const tempFolder = 'temp'
const PACKAGE_JSON = 'package.json'

const VividRepo = 'Vonage/vivid'

const WCAConfig = {
  tempFolder,
  tempFileName: 'analyzerOutput.json',
  nodeArgumentsFactory: (packageNames, analyzerOutputFile) => [
    './node_modules/web-component-analyzer/cli.js',
    'analyze',
    `node_modules/{${packageNames.join(',')}}/{src/,}*.?s`,
    '--discoverNodeModules',
    '--format', 'json',
    '--outFile', analyzerOutputFile
  ]
}

const WCAConfigAll = {
  tempFolder,
  tempFileName: 'analyzerOutput.json',
  nodeArgumentsFactory: (targetFolder, analyzerOutputFile) => [
    './node_modules/web-component-analyzer/cli.js',
    'analyze',
    `${targetFolder}/{src/,}*.?s`,
    '--format', 'json',
    '--outFile', analyzerOutputFile
  ]
}

const CLIArgument = {
  Output: 'output', // output folder
  Language: 'language', // language js,ts
  CleanTemp: 'clean', // clean up temp folder after CLI run
  All: 'all' // ignore local package.json and produce wrappers for *all* Vivid components
}

const OutputLanguage = {
  JavaScript: 'js',
  TypeScript: 'ts'
}

module.exports = {
  PACKAGE_JSON,
  OutputLanguage,
  WCAConfig,
  WCAConfigAll,
  CLIArgument,
  tempFolder,
  VividRepo
}
