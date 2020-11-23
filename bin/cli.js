const { OutputLanguage, CLIArgument, WCAConfigAll, FileName, Assets } = require('../src/consts')
const { generateWrappers } = require('../src/generator')
const {
  isFileExists,
  getParsedJson,
  getVividPackageNames,
  getInputArgument,
  getVividLatestRelease,
  getCustomElementTagsDefinitionsList,
  copyStaticAssets
} = require('../src/utils')

const outputDir = getInputArgument(CLIArgument.Output, FileName.defaultOutputDirectory)
const language = getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
const staticAssets = getInputArgument(CLIArgument.Assets, Assets)
const cleanTemp = getInputArgument(CLIArgument.CleanTemp, true) !== 'false'

getInputArgument(CLIArgument.All)
  ? getVividLatestRelease()
      .then(getCustomElementTagsDefinitionsList(WCAConfigAll))
      .then(generateWrappers(outputDir, language, cleanTemp))
      .then(() => copyStaticAssets(outputDir)(staticAssets))
  : isFileExists(FileName.packageJson)
    .then(getParsedJson)
    .then(getVividPackageNames)
    .then(getCustomElementTagsDefinitionsList())
    .then(generateWrappers(outputDir, language, cleanTemp))
    .then(() => copyStaticAssets(outputDir)(staticAssets))
