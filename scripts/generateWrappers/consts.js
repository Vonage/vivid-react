const FileName = {
  packageJson: 'package.json',
  tempFolder: 'temp',
  customElements: 'custom-elements.json',
  vividApi: 'vivid.api.json',
  tempFileName: 'analyzerOutput.json',
  tempTsFolder: 'ts',
  generatedFolder: 'src/generated',
  tempVividZipball: 'vivid.zip',
  defaultOutputDirectory: 'dist',
  storyOutputDir: 'stories',
  readme: 'README.md',
  testing: 'testing',
  types: 'types'
}

const Assets = [
  FileName.packageJson,
  FileName.readme,
  FileName.testing,
  FileName.types
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

const CLIArgument = {
  Assets: 'assets', // static assets to be copied to output folder
  Output: 'output', // output folder
  Language: 'language', // language js,ts
  CleanTemp: 'clean' // clean up temp folder after CLI run
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
  VwcChipSet: [{ name: 'MDCChip:selection', propName: 'onSelection' }],
  VwcDataGrid: [{ name: 'selected-items-changed', propName: 'onSelectedItemsChange' }],
  VwcDialog: ['opening', 'opened', 'closing', 'closed'],
  VwcIconButton: ['click'],
  VwcIconButtonToggle: [{ name: 'MDCIconButtonToggle:change', propName: 'onChange' }],
  VwcListExpansionPanel: ['closed', 'opened'],
  VwcListItem: ['click', { name: 'request-selected', propName: 'onRequestSelected' }],
  VwcCheckListItem: [{ name: 'request-selected', propName: 'onRequestSelected' }],
  VwcPagination: ['change'],
  VwcRadio: ['change'],
  VwcSlider: ['change'],
  VwcSnackbar: ['opening', 'opened', 'closing', 'closed'],
  VwcSwitch: ['change'],
  VwcTab: [{ name: 'MDCTab:interacted', propName: 'onInteracted' }],
  VwcTabBar: [{ name: 'MDCTabBar:activated', propName: 'onActivated' }],
  VwcTextfield: ['input', 'blur', 'focus'],
  VwcTextarea: ['input', 'blur', 'focus']
}

/**
 * Some Vivid custom elements classes breaks the naming convention, this map is needed to mitigate that fact
 */
const ClassNameAlias = {
  ListboxOption: 'Option'
}

const ComponentsEventsMapV3 = {
  VwcAccordion: ['change'],
  VwcTab: ['click'],
  VwcTabs: ['change'],
  VwcButton: ['click'],
  VwcSplitButton: ['click'],
  VwcSelect: ['change'],
  VwcSwitch: ['click', 'change'],
  VwcRadio: ['change'],
  VwcRadioGroup: ['change'],
  VwcMenuItem: ['change'],
  VwcNumberField: ['change', 'input'],
  VwcTextArea: ['input'],
  VwcTextField: ['input'],
  VwcCheckbox: ['change'],
  VwcCombobox: ['change'],
  VwcDatePicker: ['change', 'input'],
}

const ComponentsReadOnlyPropertiesMap = {
  VwcAccordion: ['styles'],
  VwcActionGroup: ['styles'],
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

// Properties reflected as attributes having different name
const RenamedReflectedAttributesPropertiesMap = {
  VwcText: ['fontFace'], // font-face attribute
  VwcLayout: ['columnBasis', 'columnSpacing', 'autoSizing']
}

// Bindable means property has complex type: (Function, Object, Array, etc.) OR properties reflected as attributes having different name
// Those properties needs to be binded directly to the underlying web element "as is"
// w/o toString => fromString transformations via HTML attributes
const ComponentsBindablePropertiesMap = {
  VwcButton: ['form'],
  VwcTextarea: ['form'],
  VwcTextfield: ['form'],
  VwcDataGrid: ['rowDetailsRenderer'],
  VwcDataGridColumn: ['headerRenderer', 'footerRenderer', 'cellRenderer'],
  VwcDialog: ['closeButton'],
  VwcMenu: ['anchor'],
  ...RenamedReflectedAttributesPropertiesMap
}

// Extra properties to be exposed for element
const ComponentsExtraPropertiesMap = {
  VwcIconButton: [
    {
      'name': 'value',
      'type': 'string'
    }
  ]
}

const Vivid3ComponentsExtraPropertiesMap = {
  TextField: [
    {
      name: 'icon',
      type: { text: 'string | undefined' }
    },
    {
      name: 'value',
      type: { text: 'string | undefined' }
    },
    {
      name: 'placeholder',
      type: { text: 'string | undefined' }
    },
    {
      name: 'label',
      type: { text: 'string | undefined' }
    },
    {
      name: 'onInput',
      type: { text: 'any' }
    }
  ],
  Checkbox: [
    {
      name: 'checked',
      type: { text: 'boolean' }
    },
    {
      name: 'onClick',
      type: { text: 'any' }
    }
  ],
  Button: [
    {
      name: 'icon',
      type: { text: 'string | undefined' }
    },
    {
      name: 'disabled',
      type: { text: 'boolean | undefined' }
    },
    {
      name: 'icon-trailing',
      type: { text: 'boolean | undefined' }
    }
  ],
  Tooltip: [
    {
      name: 'anchor',
      type: { text: 'string | HTMLElement' }
    }
  ],
  Toggletip: [
    {
      name: 'anchor',
      type: { text: 'string | HTMLElement' }
    }
  ],
  MenuItem: [
    {
      name: 'icon',
      type: { text: 'string | undefined' }
    }
  ],
  Switch: [
    {
      name: 'checked',
      type: { text: 'boolean' }
    },
    {
      name: 'readonly',
      type: { text: 'boolean' }
    },
    {
      name: 'disabled',
      type: { text: 'boolean' }
    },
    {
      name: 'value',
      type: { text: 'string | undefined' }
    },
    {
      name: 'name',
      type: { text: 'string | undefined' }
    }
  ],
  DatePicker: [
    {
      name: 'errorText',
      type: { text: 'string | undefined' }
    }
  ]
}

const CompoundComponentsMap = {
  VwcButton: {
    CallToAction: {
      unelevated: true,
      connotation: 'cta',
      type: 'button',
      layout: 'filled'
    },
    Alert: {
      unelevated: true,
      connotation: 'alert',
      type: 'button',
      layout: 'filled'
    },
    Outlined: {
      unelevated: true,
      layout: 'outlined',
      type: 'button'
    },
    Success: {
      unelevated: true,
      connotation: 'success',
      type: 'button',
      layout: 'filled'
    },
    Info: {
      unelevated: true,
      connotation: 'info',
      type: 'button',
      layout: 'filled'
    },
    Primary: {
      unelevated: true,
      connotation: 'primary',
      type: 'button',
      layout: 'filled'
    },
    Announcement: {
      unelevated: true,
      connotation: 'announcement',
      type: 'button',
      layout: 'filled'
    }
  }
}

module.exports = {
  ComponentsEventsMap,
  ComponentsEventsMapV3,
  ComponentsReadOnlyPropertiesMap,
  ComponentsBindablePropertiesMap,
  ComponentsExtraPropertiesMap,
  CompoundComponentsMap,
  ClassNameAlias,
  FileName,
  Assets,
  OutputLanguage,
  WCAConfig,
  CLIArgument,
  VividRepo,
  Vivid3ComponentsExtraPropertiesMap
}
