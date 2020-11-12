const { getVividPackageNames, event2PropName } = require('./utils')

it('getVividPackageNames', () => {
  const packageJson = {
    dependencies: {
      "@vonage/vwc-button": "0.1",
      "@vonage/vwc-icon": "0.2",
      "@nvm/vwc-badge": "0.2",
    },
    devDependencies: {
      "@vonage/vwc-dropdown": "0.1",
      "@vonage/component": "0.2",
    },
    otherDependencies: {
      "@vonage/vwc-nav": "0.3",
    }
  }
  const expectedList = [
    '@vonage/vwc-button',
    '@vonage/vwc-icon',
    '@vonage/vwc-dropdown'
  ]
  expect(getVividPackageNames(packageJson)).toStrictEqual(expectedList);
});

it.each([
  ['digit-added', 'onDigitAdded'],
  ['userScrubRequest', 'onUserScrubRequest'],
  ['vvd_scheme_select', 'onVvdSchemeSelect']
])(`event2PropName should convert "%s" to "%s"`, (input, expected) => {
  expect(event2PropName(input)).toStrictEqual(expected);
});
