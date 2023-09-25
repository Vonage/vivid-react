# @vonage/vivid-react

Vivid-react is a script allowing you to generate `Vivid-React` components for the newest version of `Vivid` components stored as a package with all necessary dependencies and available through Artifactory npm registry.

The main goal of output package is to provide a better developer experience when using `Vivid` inside of `React` typescript applications. We still use regular `Vivid` web components, so be sure to target a recent browser.

Goals:
* wrap adding handlers for events like `change` which natively doesn't work in the environment
* mocks for Jest
* typing support (prop-types or typescript)
* a handy interface for initialisation (eg. fonts)
* getting advantages of JSX/TSX (eg. composed components*)
* all components within one package**
* storybook acting as developer sandbox for presenting quick examples
* one place for all future vivid-related code to use with React

*may provide a cut off at props inherited from MWC source.

**now also implemented in _raw_ Vivid.

# Similar strongly typed wrappers for other frameworks?
* https://github.com/Vonage/vivid-vue

# Why is this repository exists?

[![Using Web Components in React - Web Component Essentials](https://img.youtube.com/vi/o1dMXrIv3Q8/0.jpg)](https://www.youtube.com/watch?v=o1dMXrIv3Q8)

## Supported components
Here's the list of all available wrappers, with the `Vivid` package name and version used to generate each one.
If you need to use a different version of a `Vivid` component, simply add it to your application's `package.json`.
Adding the `resolutions` field when using `yarn` might help get the correct version installed.

| Component Name | Package Name | Package Version |
|----------------|--------------|-----------------|
| VwcAccordion | @vonage/vwc-accordion | 2.43.2 |
| VwcActionGroup | @vonage/vwc-action-group | 2.43.2 |
| VwcBadge | @vonage/vwc-badge | 2.43.2 |
| VwcBanner | @vonage/vwc-banner | ^2.44.0 |
| VwcButton | @vonage/vwc-button | 2.43.2 |
| VwcButtonToggleGroup | @vonage/vwc-button-toggle-group | 2.43.2 |
| VwcCalendar | @vonage/vwc-calendar | 2.43.2 |
| VwcCard | @vonage/vwc-card | 2.43.2 |
| VwcCarousel | @vonage/vwc-carousel | 2.43.2 |
| VwcCheckbox | @vonage/vwc-checkbox | 2.43.2 |
| VwcChips | @vonage/vwc-chips | 2.43.2 |
| VwcCircularProgress | @vonage/vwc-circular-progress | 2.43.2 |
| VwcDataGrid | @vonage/vwc-data-grid | 2.43.2 |
| VwcDatepicker | @vonage/vwc-datepicker | 2.43.2 |
| VwcDialog | @vonage/vwc-dialog | 2.43.2 |
| VwcDrawer | @vonage/vwc-drawer | 2.43.2 |
| VwcDropdown | @vonage/vwc-dropdown | 2.43.2 |
| VwcElevation | @vonage/vwc-elevation | 2.43.2 |
| VwcEmptyState | @vonage/vwc-empty-state | 2.43.2 |
| VwcExpansionPanel | @vonage/vwc-expansion-panel | 2.43.2 |
| VwcFab | @vonage/vwc-fab | 2.43.2 |
| VwcFilePicker | @vonage/vwc-file-picker | ^2.44.0 |
| VwcFormfield | @vonage/vwc-formfield | 2.43.2 |
| VwcHelperMessage | @vonage/vwc-helper-message | 2.43.2 |
| VwcIcon | @vonage/vwc-icon | 2.43.2 |
| VwcIconButton | @vonage/vwc-icon-button | 2.43.2 |
| VwcIconButtonToggle | @vonage/vwc-icon-button-toggle | 2.43.2 |
| VwcKeypad | @vonage/vwc-keypad | 2.43.2 |
| VwcLayout | @vonage/vwc-layout | 2.43.2 |
| VwcLinearProgress | @vonage/vwc-linear-progress | 2.43.2 |
| VwcList | @vonage/vwc-list | 2.43.2 |
| VwcMediaController | @vonage/vwc-media-controller | ^2.44.0 |
| VwcMenu | @vonage/vwc-menu | 2.43.2 |
| VwcNotchedOutline | @vonage/vwc-notched-outline | 2.43.2 |
| VwcNote | @vonage/vwc-note | 2.43.2 |
| VwcPagination | @vonage/vwc-pagination | 2.43.2 |
| VwcPopup | @vonage/vwc-popup | 2.43.2 |
| VwcRadio | @vonage/vwc-radio | 2.43.2 |
| VwcSchemeSelect | @vonage/vwc-scheme-select | 2.43.2 |
| VwcSelect | @vonage/vwc-select | 2.43.2 |
| VwcSideDrawer | @vonage/vwc-side-drawer | 2.43.2 |
| VwcSlider | @vonage/vwc-slider | 2.43.2 |
| VwcSnackbar | @vonage/vwc-snackbar | 2.43.2 |
| VwcSurface | @vonage/vwc-surface | 2.43.2 |
| VwcSwitch | @vonage/vwc-switch | 2.43.2 |
| VwcTabBar | @vonage/vwc-tab-bar | 2.43.2 |
| VwcTags | @vonage/vwc-tags | 2.43.2 |
| VwcText | @vonage/vwc-text | 2.43.2 |
| VwcTextarea | @vonage/vwc-textarea | 2.43.2 |
| VwcTextfield | @vonage/vwc-textfield | 2.43.2 |
| VwcThemeSwitch | @vonage/vwc-theme-switch | 2.43.2 |
| VwcTooltip | @vonage/vwc-tooltip | 2.43.2 |
| VwcTopAppBar | @vonage/vwc-top-app-bar | 2.43.2 |
| VwcTopAppBarFixed | @vonage/vwc-top-app-bar-fixed | 2.43.2 |

If the one you're looking for is missing, just [add a new one](#adding-a-component), so everyone can access them.

## Installation
Just run:
```shell
$ yarn add @vonage/vivid-react
```
No need for importing `vivid` directly. The dependencies will be installed for you.

## Initialization

```javascript
import ReactDOM from 'react-dom'
import { initVivid } from '@vonage/vivid-react'
const rootElement = document.getElementById('react-root')
const renderApp = () => {
  // do some more initialization before rendering the main App
  ReactDOM.render(
    <App />,
    rootElement
  )
}

// for Vivid 2.x
initVivid(rootElement).then(renderApp)

// OR

// for Vivid 2.x + Vivid 3.x
initVivid(rootElement, () => {}, {
  font: 'oss',
  theme: 'light'
}).then(renderApp)
```

## Importing
For vivid **2.x**
Instead of importing each `vivid` component from `@vonage/vwc-*`, import them from `@vonage/vivid-react` instead.
```javascript
import VwcCheckbox from '@vonage/vivid-react/VwcCheckbox'
import VwcSlider from '@vonage/vivid-react/VwcSlider'
```

For vivid **3.x**
```javascript
import VwcCheckbox from '@vonage/vivid-react/v3/VwcCheckbox'
import VwcSlider from '@vonage/vivid-react/v3/VwcSlider'
```

## Bundling
This package is an ES module, so you might need to add some configuration to your bundling process.

## Testing
If you have problems rendering `vivid` when using Jest/Enzyme combo, you can add this to your `package.json` to replace all `Vivid` wrapped components with an empty React component.
It'll work also for _raw_ `vivid` components used in project, since js-dom doesn't support shadow DOM.

```json
{
  "jest": {
    "moduleNameMapper": {
      "@vonage\/(vwc|vvd)": "@vonage/vivid-react/testing/component.mock.js"
    },
  "transformIgnorePatterns": [
      "node_modules/(?!(@cct|@vonage|@lit|lit-html|lit-element)/)"
    ]
  }
}
```

# Development

## Adding a component
Follow the steps:
* clone this repo
* create a branch
* add the missing vivid component as a `dependency` in `package.json`
* create a new PR and get it merged to `master`
* [publish](#publishing-a-new-version) new version
* install the new package in your application

## Publishing a new version
When you want to release the latest changes, checkout the latest `master` branch and run:

```shell
$ yarn version --new-version {minor/major/patch}
```

### Selecting new version number:
- `patch` - fixing some small issue, without new functionality
- `minor` - after adding support for a new component, or adding a new awesome feature
- `major` - after breaking or major package changes

## Storybook

For test/development storybook is in game. Stories are generated automatically per component
with no arguments/properties, fill them before using component.

## Compound Components

In the `scripts/generateWrappers/consts.js` you can define sets of compound components. All they do is filling default props. They are accessible after a dot:
```javascript
<VwcButton.Alert />
```

*This is the end*
