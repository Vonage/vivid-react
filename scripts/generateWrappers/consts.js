const FileName = {
  packageJson: 'package.json',
  tempFolder: 'temp',
  tempFileName: 'analyzerOutput.json',
  tempTsFolder: 'ts',
  tempVividZipball: 'vivid.zip',
  defaultOutputDirectory: 'dist',
  storyOutputDir: 'stories',
  readme: 'README.md',
  testing: 'testing'
}

const Assets = [
  FileName.packageJson,
  FileName.readme,
  FileName.testing
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

// TODO: this can be removed when JSDocs for each component will be updated in Vivid repository
const ComponentsEventsMap = {
  VwcButton: ['click'],
  VwcIconButton: ['click'],
  VwcDialog: ['opening', 'opened', 'closing', 'closed'],
  VwcListExpansionPanel: ['closed', 'opened'],
  VwcIconButtonToggle: [{ name: 'MDCIconButtonToggle:change', propName: 'onChange' }],
  VwcCheckbox: ['change'],
  VwcRadio: ['change'],
  VwcSlider: ['change'],
  VwcSwitch: ['change'],
  VwcTab: [{ name: 'MDCTab:interacted', propName: 'onInteracted' }],
  VwcTabBar: [{ name: 'MDCTabBar:activated', propName: 'onActivated' }]
}

const ComponentsPropertiesMap = {
  VwcTextfield: ['validityTransform', 'setCustomValidity']
}

const CompoundComponentsMap = {
  VwcButton: {
    CTA: {
      connotation: 'cta',
      type: 'button',
      layout: 'filled'
    },
    Alert: {
      connotation: 'alert',
      type: 'button',
      layout: 'filled'
    },
    Outlined: {
      layout: 'outlined',
      type: 'button'
    }
  }
}

module.exports = {
  ComponentsEventsMap,
  ComponentsPropertiesMap,
  CompoundComponentsMap,
  FileName,
  Assets,
  OutputLanguage,
  WCAConfig,
  WCAConfigAll,
  CLIArgument,
  VividRepo
}
