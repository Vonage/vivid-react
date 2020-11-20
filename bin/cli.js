const { OutputLanguage, CLIArgument, WCAConfigAll, PACKAGE_JSON } = require('../src/consts')
const { generateWrappers } = require('../src/generator')
const {
  isFileExists,
  getParsedJson,
  getVividPackageNames,
  getInputArgument,
  getVividLatestRelease,
  getCustomElementTagsDefinitionsList
} = require('../src/utils')

const OutputDirectory = './dist'

getInputArgument(CLIArgument.All)
  ? getVividLatestRelease()
      .then(getCustomElementTagsDefinitionsList(WCAConfigAll))
      .then(generateWrappers(
        getInputArgument(CLIArgument.Output, OutputDirectory),
        getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
      ))
  : isFileExists(PACKAGE_JSON)
    .then(getParsedJson)
    .then(getVividPackageNames)
    .then(getCustomElementTagsDefinitionsList())
    .then(generateWrappers(
      getInputArgument(CLIArgument.Output, OutputDirectory),
      getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
    ))
