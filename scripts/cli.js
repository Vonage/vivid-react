const { OutputLanguage, CLIArgument, FileName, Assets } = require('./generateWrappers/consts')
const { generateWrappers, generateWrappersV3 } = require('./generateWrappers/generator')
const {
  isFileExists,
  readMetaData,
  getParsedJson,
  getVividPackageNames,
  getInputArgument,
  getCustomElementTagsDefinitionsList,
  copyStaticAssets
} = require('./generateWrappers/utils')

const outputDir = getInputArgument(CLIArgument.Output, FileName.defaultOutputDirectory)
const language = getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
const staticAssets = getInputArgument(CLIArgument.Assets, Assets)
const cleanTemp = getInputArgument(CLIArgument.CleanTemp, true) !== 'false'

// generate wrappers for Vivid 2.x
isFileExists(FileName.packageJson)
  .then(getParsedJson)
  .then(getVividPackageNames)
  .then(getCustomElementTagsDefinitionsList())
  .then(generateWrappers(outputDir, language, cleanTemp))
  .then(() => readMetaData() // generate wrappers for Vivid 3.x
    .then(generateWrappersV3(outputDir, language, cleanTemp)))
  .then(copyStaticAssets(outputDir, staticAssets))

