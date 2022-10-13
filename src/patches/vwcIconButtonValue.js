/**
 * Patches value attribute missing. You can pass now a value to the VwcIconButton as
 * in normal buttons
 *
 * @param {any} value
 * @param {HTMLElement} iconButtonElement
 * @returns
 */
export const vwcIconButtonValue = (value) => (element) => {
  element?.setAttribute('value', value)
}
