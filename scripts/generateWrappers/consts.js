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
  VwcListItem: [{ name: 'request-selected', propName: 'onRequestSelected' }],
  VwcListExpansionPanel: ['closed', 'opened'],
  VwcIconButtonToggle: [{ name: 'MDCIconButtonToggle:change', propName: 'onChange' }],
  VwcCheckbox: ['change'],
  VwcRadio: ['change'],
  VwcSlider: ['change'],
  VwcSwitch: ['change'],
  VwcTextfield: ['input'],
  VwcTab: [{ name: 'MDCTab:interacted', propName: 'onInteracted' }],
  VwcTabBar: [{ name: 'MDCTabBar:activated', propName: 'onActivated' }]
}

const ComponentsReadOnlyPropertiesMap = {
  VwcAudio: ['styles', 'floatingLabelFoundation', 'lineRippleFoundation'],
  VwcListExpansionPanel: ['styles', 'headerNodes'],
  VwcList: ['styles', 'items'],
  VwcListItem: ['styles', 'ripple', 'text'],
  VwcSwitch: ['styles', 'ripple'],
  VwcTab: ['styles', 'active', 'ripple', 'isRippleActive'],
  VwcFab: ['styles', 'ripple'],
  VwcTabBar: ['styles', 'active'],
  VwcTextarea: ['styles', 'validity'],
  VwcTextfield: ['styles', 'validity', 'willValidate', 'selectionStart', 'selectionEnd', 'ripple'],
  VwcMenu: ['styles', 'slotElement', 'items'],
  VwcRadio: ['styles', 'isRippleActive'],
  VwcRadioListItem: ['styles', 'ripple'],
  VwcSelect: ['styles', 'items'],
  VwcCheckbox: ['styles', 'isRippleActive'],
  VwcChipSet: ['styles', 'chips'],
  VwcCheckListItem: ['styles', 'ripple'],
  VwcDialog: ['styles'],
  VwcButton: ['styles', 'buttonElement', 'ripple'],
  VwcKeypad: ['styles', 'digitsDisplay'],
  VwcIconButton: ['styles', 'buttonElement', 'ripple'],
  VwcIconButtonToggle: ['styles', 'ripple'],
  VwcDataGrid: ['styles', 'selectedItems'],
  VwcSlider: ['styles', 'ripple']
}

const CompoundComponentsMap = {
  VwcButton: {
    CallToAction: {
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
    },
    Success: {
      connotation: 'success',
      type: 'button',
      layout: 'filled'
    },
    Info: {
      connotation: 'info',
      type: 'button',
      layout: 'filled'
    },
    Primary: {
      connotation: 'primary',
      type: 'button',
      layout: 'filled'
    },
    Announcement: {
      connotation: 'announcement',
      type: 'button',
      layout: 'filled'
    }
  }
}

module.exports = {
  ComponentsEventsMap,
  ComponentsReadOnlyPropertiesMap,
  CompoundComponentsMap,
  FileName,
  Assets,
  OutputLanguage,
  WCAConfig,
  WCAConfigAll,
  CLIArgument,
  VividRepo
}
