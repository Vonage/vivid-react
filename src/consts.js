const FileName = {
  packageJson: 'package.json',
  tempFolder: 'temp',
  tempFileName: 'analyzerOutput.json',
  tempTsFolder: 'ts',
  tempVividZipball: 'vivid.zip',
  defaultOutputDirectory: 'dist',
  indexHtml: 'index.html',
  readme: 'README.md',
  supportedComponents: 'SUPPORTED_COMPONENTS.md'
}

const Assets = [
  FileName.packageJson,
  FileName.readme,
  FileName.supportedComponents
].join(',')

const VividRepo = 'Vonage/vivid'

const WCAConfig = {
  tempFolder: FileName.tempFolder,
  tempFileName: FileName.tempFileName,
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
  tempFolder: FileName.tempFolder,
  tempFileName: FileName.tempFileName,
  nodeArgumentsFactory: (targetFolder, analyzerOutputFile) => [
    './node_modules/web-component-analyzer/cli.js',
    'analyze',
    `${targetFolder}/{src/,}*.?s`,
    '--format', 'json',
    '--outFile', analyzerOutputFile
  ]
}

const CLIArgument = {
  Assets: 'assets', // static assets to be copied to output folder
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
  FileName,
  Assets,
  OutputLanguage,
  WCAConfig,
  WCAConfigAll,
  CLIArgument,
  VividRepo
}
