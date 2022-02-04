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
  VwcButtonToggleGroup: ['selected'],
  VwcButton: ['click'],
  VwcCard: ['click'],
  VwcCheckbox: ['change'],
  VwcChipSet: [{ name: 'MDCChip:selection', propName: 'onSelection'}],
  VwcDataGrid: [{ name: 'selected-items-changed', propName: 'onSelectedItemsChange' }],
  VwcDialog: ['opening', 'opened', 'closing', 'closed'],
  VwcIconButton: ['click'],
  VwcIconButtonToggle: [{ name: 'MDCIconButtonToggle:change', propName: 'onChange' }],
  VwcListExpansionPanel: ['closed', 'opened'],
  VwcListItem: [{ name: 'request-selected', propName: 'onRequestSelected' }],
  VwcCheckListItem: [{ name: 'request-selected', propName: 'onRequestSelected' }],
  VwcRadio: ['change'],
  VwcSlider: ['change'],
  VwcSnackbar: ['opening', 'opened', 'closing', 'closed'],
  VwcSwitch: ['change'],
  VwcTab: [{ name: 'MDCTab:interacted', propName: 'onInteracted' }],
  VwcTabBar: [{ name: 'MDCTabBar:activated', propName: 'onActivated' }],
  VwcTextfield: ['input']
}

const ComponentsReadOnlyPropertiesMap = {
  VwcAccordion: ['styles'],  
  VwcAudio: ['styles', 'floatingLabelFoundation', 'lineRippleFoundation'],
  VwcListExpansionPanel: ['styles', 'headerNodes'],
  VwcExpansionPanel: ['styles'],
  VwcBadge: ['styles'],
  VwcBanner: ['styles'],
  VwcDrawer: ['styles'],
  VwcNotchedOutline: ['styles'],
  VwcSurface: ['styles'],
  VwcFilePicker: ['styles'],
  VwcFormfield: ['styles'],
  VwcHelperMessage: ['styles'],
  VwcLinearProgress: ['styles'],
  VwcThemeSwitch: ['styles'],
  VwcTopAppBar: ['styles'],
  VwcChip: ['styles'],
  VwcCircularProgress: ['styles'],
  VwcTopAppBarFixed: ['styles'],
  VwcMediaController: ['floatingLabelFoundation', 'lineRippleFoundation'],
  VwcRelativeTime: ['floatingLabelFoundation', 'lineRippleFoundation'],
  VwcCarouselItem: ['floatingLabelFoundation', 'lineRippleFoundation'],
  VwcList: ['styles', 'items', 'selected', 'index', 'layout', 'debouncedLayout'],
  VwcListItem: ['styles', 'ripple', 'text'],
  VwcLayout: ['styles'],
  VwcSwitch: ['styles', 'ripple'],
  VwcTab: ['styles', 'active', 'ripple', 'isRippleActive'],
  VwcFab: ['styles', 'ripple'],
  VwcTabBar: ['styles', 'active'],
  VwcText: ['styles'],
  VwcTextarea: ['styles', 'validity', 'ripple'],
  VwcTextfield: ['styles', 'validity', 'willValidate', 'selectionStart', 'selectionEnd', 'ripple'],
  VwcMenu: ['styles', 'slotElement', 'items', 'index', 'selected', 'mdcRoot'],
  VwcRadio: ['styles', 'ripple', 'isRippleActive'],
  VwcRadioListItem: ['styles', 'ripple'],
  VwcSelect: ['styles', 'items', 'ripple'],
  VwcCheckbox: ['styles', 'isRippleActive', 'ripple'],
  VwcChipSet: ['styles', 'chips'],
  VwcCheckListItem: ['styles', 'ripple'],
  VwcDialog: ['styles'],
  VwcDropdown: ['styles', 'items', 'selected'],
  VwcButton: ['styles', 'buttonElement', 'ripple'],
  VwcButtonToggleGroup: ['items', 'selected'],
  VwcKeypad: ['styles', 'digitsDisplay'],
  VwcIconButton: ['styles', 'buttonElement', 'ripple'],
  VwcIconButtonToggle: ['styles', 'ripple'],
  VwcDataGrid: ['styles', 'selectedItems'],
  VwcSlider: ['styles', 'ripple']
}

// Bindable means property has complex type: Function, Object, Array, etc.
// Those properties needs to be binded directly to the underlying web element "as is"
// w/o toString => fromString transformations via HTML attributes
const ComponentsBindablePropertiesMap = {
  VwcButton: ['form'],
  VwcText: ['fontFace'],
  VwcCard: ['headerIcon', 'supportingText'],
  VwcTextarea: ['form'],
  VwcTextfield: ['form'],
  VwcDataGrid: ['rowDetailsRenderer'],
  VwcDataGridColumn: ['headerRenderer', 'footerRenderer', 'cellRenderer'],
  VwcDialog: ['closeButton'],
  VwcMenu: ['anchor']
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
  ComponentsBindablePropertiesMap,
  CompoundComponentsMap,
  FileName,
  Assets,
  OutputLanguage,
  WCAConfig,
  WCAConfigAll,
  CLIArgument,
  VividRepo
}
