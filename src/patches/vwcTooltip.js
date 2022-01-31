/**
 * Patches provided HTMLElement (styles) to crop long text and 
 * shows browser tooltip when actually cropped
 *
 * @param {HTMLElement} element - target element to apply the text cropping logic to
 * @example <span ref={vwcTooltipEllipsisDecorator(text)} >{text}</span>
 */
export const vwcTooltipEllipsisDecorator = fullText => element =>
    setTimeout(() => {
        if (element) {
            element.style.overflow = 'hidden'
            element.style.display = 'block'
            element.style['white-space'] = 'nowrap'
            element.style['text-overflow'] = 'ellipsis'
        }
        if (element && element.offsetWidth < element.scrollWidth) {
            element.setAttribute('title', fullText)
        }
    }, 0)
