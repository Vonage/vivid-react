# @vonage/vivid-react

Vivid-react is a script allowing you to generate `Vivid-React` components for the newest version of `Vivid` components stored as a package with all necessary dependencies and available through Artifactory npm registry.

The main goal of output package is to provide a better developer experience when using `Vivid` inside of `React` applications. We still use regular `Vivid` web components, so be sure to target a recent browser. 

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

## Supported components
Here's the list of all available wrappers, with the `Vivid` package name and version used to generate each one.
If you need to use a different version of a `Vivid` component, simply add it to your application's `package.json`.
Adding the `resolutions` field when using `yarn` might help get the correct version installed.

| Component Name | Package Name | Package Version |
|----------------|--------------|-----------------|
| VwcAccordion | @vonage/vwc-accordion | ^2.20.1 |
| VwcAudio | @vonage/vwc-audio | ^2.20.1 |
| VwcBadge | @vonage/vwc-badge | ^2.20.1 |
| VwcBanner | @vonage/vwc-banner | ^2.20.1 |
| VwcButton | @vonage/vwc-button | ^2.20.1 |
| VwcButtonToggleGroup | @vonage/vwc-button-toggle-group | ^2.20.1 |
| VwcCalendar | @vonage/vwc-calendar | ^2.20.1 |
| VwcCard | @vonage/vwc-card | ^2.20.1 |
| VwcCarousel | @vonage/vwc-carousel | ^2.20.1 |
| VwcCheckbox | @vonage/vwc-checkbox | ^2.20.1 |
| VwcChips | @vonage/vwc-chips | ^2.20.1 |
| VwcCircularProgress | @vonage/vwc-circular-progress | ^2.20.1 |
| VwcDataGrid | @vonage/vwc-data-grid | ^2.20.1 |
| VwcDatepicker | @vonage/vwc-datepicker | ^2.20.1 |
| VwcDialog | @vonage/vwc-dialog | ^2.20.1 |
| VwcDrawer | @vonage/vwc-drawer | ^2.20.1 |
| VwcDropdown | @vonage/vwc-dropdown | ^2.20.1 |
| VwcEmptyState | @vonage/vwc-empty-state | ^2.20.1 |
| VwcExpansionPanel | @vonage/vwc-expansion-panel | ^2.20.1 |
| VwcFab | @vonage/vwc-fab | ^2.20.1 |
| VwcFilePicker | @vonage/vwc-file-picker | ^2.20.1 |
| VwcFormfield | @vonage/vwc-formfield | ^2.20.1 |
| VwcHelperMessage | @vonage/vwc-helper-message | ^2.20.1 |
| VwcIcon | @vonage/vwc-icon | ^2.20.1 |
| VwcIconButton | @vonage/vwc-icon-button | ^2.20.1 |
| VwcIconButtonToggle | @vonage/vwc-icon-button-toggle | ^2.20.1 |
| VwcLayout | @vonage/vwc-layout | ^2.20.1 |
| VwcKeypad | @vonage/vwc-keypad | ^2.20.1 |
| VwcLinearProgress | @vonage/vwc-linear-progress | ^2.20.1 |
| VwcList | @vonage/vwc-list | ^2.20.1 |
| VwcMediaController | @vonage/vwc-media-controller | ^2.20.1 |
| VwcMenu | @vonage/vwc-menu | ^2.20.1 |
| VwcNotchedOutline | @vonage/vwc-notched-outline | ^2.20.1 |
| VwcNote | @vonage/vwc-note | ^2.20.1 |
| VwcPagination | @vonage/vwc-pagination | ^2.20.1 |
| VwcRadio | @vonage/vwc-radio | ^2.20.1 |
| VwcSchemeSelect | @vonage/vwc-scheme-select | ^2.20.1 |
| VwcSelect | @vonage/vwc-select | ^2.20.1 |
| VwcSideDrawer | @vonage/vwc-side-drawer | ^2.20.1 |
| VwcSlider | @vonage/vwc-slider | ^2.20.1 |
| VwcSnackbar | @vonage/vwc-snackbar | ^2.20.1 |
| VwcSurface | @vonage/vwc-surface | ^2.20.1 |
| VwcSwitch | @vonage/vwc-switch | ^2.20.1 |
| VwcTabBar | @vonage/vwc-tab-bar | ^2.20.1 |
| VwcTags | @vonage/vwc-tags | ^2.20.1 |
| VwcText | @vonage/vwc-text | ^2.20.1 |
| VwcTextarea | @vonage/vwc-textarea | ^2.20.1 |
| VwcTextfield | @vonage/vwc-textfield | ^2.20.1 |
| VwcThemeSwitch | @vonage/vwc-theme-switch | ^2.20.1 |
| VwcTopAppBar | @vonage/vwc-top-app-bar | ^2.20.1 |
| VwcTopAppBarFixed | @vonage/vwc-top-app-bar-fixed | ^2.20.1 |

If the one you're looking for is missing, just [add a new one](#adding-a-component), so everyone can access them.

# Usage

## Artifactory
To use this package, you need to have Artifactory setup for your project. See how to do it [here](https://confluence.vonage.com/pages/viewpage.action?pageId=123601806) and [here](https://github.com/newvoicemedia/vonage-cli/blob/master/pipeline-guide/how-to/NODEJS-NPM-DEVELOPMENT.md). 

## Installation
Once you have Artifactory configured, just run:
```shell
$ yarn add @vonage/vivid-react
```
No need for importing `vivid` directly. The dependencies will be installed for you.
 
## Font initialization
There are 2 ways to initialize Vivid context & fonts. You can use initialization function or HOC.

```javascript
// Function
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

initVivid(rootElement, renderApp)
```

```javascript
// HOC
import ReactDOM from 'react-dom'
import { withVivid } from '@vonage/vivid-react'

ReactDOM.render(
  withVivid(App),
  document.getElementById('react-root')
)
```
 
## Importing
Instead of importing each `vivid` component from `@vonage/vwc-*`, import them from `@vonage/vivid-react` instead. 
```javascript
import VwcCheckbox from '@vonage/vivid-react/VwcCheckbox'
import VwcSlider from '@vonage/vivid-react/VwcSlider'
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
      "@vonage\/vwc": "@vonage/vivid-react/testing/component.mock.js"
    }
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
