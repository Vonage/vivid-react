const { getVividPackageNames, event2PropName, compoundComponents } = require('./utils')

it('getVividPackageNames', () => {
  const packageJson = {
    dependencies: {
      '@vonage/vwc-button': '0.1',
      '@vonage/vwc-icon': '0.2',
      '@nvm/vwc-badge': '0.2'
    },
    devDependencies: {
      '@vonage/vwc-dropdown': '0.1',
      '@vonage/component': '0.2'
    },
    otherDependencies: {
      '@vonage/vwc-nav': '0.3'
    }
  }
  const expectedList = [
    '@vonage/vwc-button',
    '@vonage/vwc-icon',
    '@vonage/vwc-dropdown'
  ]
  expect(getVividPackageNames(packageJson)).toStrictEqual(expectedList)
})

it.each([
  ['digit-added', 'onDigitAdded'],
  ['userScrubRequest', 'onUserScrubRequest'],
  ['vvd_scheme_select', 'onVvdSchemeSelect']
])(`event2PropName should convert "%s" to "%s"`, (input, expected) => {
  expect(event2PropName(input)).toStrictEqual(expected)
})

it('compound components', () => {
  const config = {
    VwcButton: {
      CTA: {
        connotation: 'cta',
        layout: 'filled'
      },
      Alert: {
        connotation: 'alert',
        layout: 'filled'
      }
    }
  }
  const expected = `const CTA = (props) => createElement(VwcButton, props)

CTA.defaultProps = {"connotation":"cta","layout":"filled"}

VwcButton.CTA = CTA

const Alert = (props) => createElement(VwcButton, props)

Alert.defaultProps = {"connotation":"alert","layout":"filled"}

VwcButton.Alert = Alert`

  expect(compoundComponents(config)('VwcButton')).toBe(expected)
})
