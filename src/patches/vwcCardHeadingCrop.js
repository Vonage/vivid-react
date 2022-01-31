import { vwcTooltipEllipsisDecorator } from "./vwcTooltip"

/**
 * Patches provided `VwcCard` (styles) to crop long heading text and 
 * shows browser tooltip when actually cropped
 *
 * @param {HTMLElement} element - target `VwcCard` element to apply the `heading` cropping logic to
 * @example <VwcCard ref={vwcCardHeadingCropDecorator(text)} heading={text} />
 */
export const vwcCardHeadingCropDecorator = text => element =>
    setTimeout(() => {
        const titleElement = element?.shadowRoot.querySelector(
            '.vwc-card-title'
        )
        vwcTooltipEllipsisDecorator(text)(titleElement)
    }, 0)
