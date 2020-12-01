# @vonage/vivid-react
The goal of this package is to provide a better developer experience when using `Vivid` inside of `React` applications. We still use regular `Vivid` web components, so be sure to target a recent browser.

## Supported components
[Here's the list](SUPPORTED_COMPONENTS.md) of `Vivid` components that have already been wrapped. If the one you're looking for is missing, just [add a new one](#adding-a-component), so every one can access them. 

# Usage

## Artifactory
To use this package, you need to have Artifactory setup for your project. See how to do it [here](https://confluence.vonage.com/pages/viewpage.action?pageId=123601806) and [here](https://github.com/newvoicemedia/vonage-cli/blob/master/pipeline-guide/how-to/NODEJS-NPM-DEVELOPMENT.md). 

## Installation
Once you have Artifactory configured, just run:
```
$ yarn add @vonage/vivid-react
```
No need for importing `vivid` directly. The dependencies will be installed for you.
 
## Importing
Instead of importing each `vivid` component from `@vonage/vwc-*`, import them from `@vonage/vivid-react` instead. 
```
// GOOD
import VwcCheckbox from '@vonage/vivid-react/VwcCheckbox'
import VwcSlider from '@vonage/vivid-react/VwcSlider'
```

Don't do this if you want tree-shaking to work properly, as this will load all of the `vivid` packages
```
// BAD
import { VwcCheckbox, VwcSlider } from '@vonage/vivid-react'
```

## Bundling
This package is an ES module, so you might need to add some configuration to your bundling process.

See [here](https://confluence.vonage.com/display/CYCLOPS/Vivid+adoption) if you need help with setting up *IE11* bundle process.

## Testing
If you have problems rendering `vivid` when using Jest/Enzyme combo, you can add this to your `package.json` to replace all `Vivid` wrapped components with an empty React component.

```
package.json

{
  ...,
  "jest": {
    ...,
    "moduleNameMapper": {
      ...,
      "@vonage/vivid-react/*": "@vonage/vivid-react/testing/component.mock.js"
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

```
$ yarn version --new-version {minor|major|patch}
```

### Selecting new version number:
- `patch` - fixing some small issue, without new functionality
- `minor` - after adding support for a new component, or adding a new awesome feature
- `major` - after breaking or major package changes

## Storybook

For test/development storybook is in game. Stories are generated automatically per component
with no arguments/properties, fill them before using component.

*This is the end*
