const { OutputLanguage, CLIArgument, WCAConfigAll, FileName } = require('../src/consts')
const { generateWrappers } = require('../src/generator')
const {
  isFileExists,
  getParsedJson,
  getVividPackageNames,
  getInputArgument,
  getVividLatestRelease,
  getCustomElementTagsDefinitionsList
} = require('../src/utils')

getInputArgument(CLIArgument.All)
  ? getVividLatestRelease()
      .then(getCustomElementTagsDefinitionsList(WCAConfigAll))
      .then(generateWrappers(
        getInputArgument(CLIArgument.Output, FileName.defaultOutputDirectory),
        getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
      ))
  : isFileExists(FileName.packageJson)
    .then(getParsedJson)
    .then(getVividPackageNames)
    .then(getCustomElementTagsDefinitionsList())
    .then(generateWrappers(
      getInputArgument(CLIArgument.Output, FileName.defaultOutputDirectory),
      getInputArgument(CLIArgument.Language, OutputLanguage.JavaScript)
    ))
