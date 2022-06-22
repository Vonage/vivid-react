/* global HTMLElement */
import context from '@vonage/vvd-context'
import { init } from '@vonage/vvd-fonts'

/**
 * mounts Vivid context (styles) & Fonts into the target scope / document
 * - target scope may by any `HTMLElement` or `Document` or `DocumentFragment` (including `ShadowRoot`)
 * - default target (when not specified) is the document visible in the current scope
 * - the API is idempotent, the style/s will be mounted only once, even if API called multiple times
 *
 * @param {Document | DocumentFragment | HTMLElement} target - target document/shadow root/element to mount the CSS into
 * @param {Function} callback - callback function to be invoked once init is done
 * @throws {Error} error - if the provided target argument is `null` or not a Node of type `Document` / `DocumentFragment` / `HTMLElement`
 */
export const initVivid = (target, callback) => {
  if (target instanceof HTMLElement) {
    target.classList.add('vivid-scope')
    target = undefined
  }
  return Promise.all([
    init(),
    context.mount(target)
  ]).then(callback)
}
