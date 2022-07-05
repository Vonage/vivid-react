/**
 * Patches provided HTMLElement (styles) to crop long text and
 * shows browser tooltip when actually cropped
 *
 * @param {HTMLElement} element - target element to apply the text cropping logic to
 * @example <span ref={vwcTooltipEllipsisDecorator(text)} >{text}</span>
 */
export const vwcTooltipEllipsisDecorator = fullText => element =>
    setTimeout(() => {
        const isTextCropped = element?.clientHeight < element?.scrollHeight
        if (isTextCropped) {
            element.setAttribute('title', fullText)
        }
    }, 0)

/**
* Patches provided VwcTooltip instance to open/close tooltip on mouse hover
*
* @param {HTMLElement} tooltipElement - target element to apply behavior to
* @param {number} timeout - timeout before showing tooltip, default: 1000
* @example <VwcTooltip ref={vwcTooltipShowOnHoverDecorator()} />
*/
export const vwcTooltipShowOnHoverDecorator = (timeout = 1000) => tooltipElement =>
    setTimeout(() => {
        if (!tooltipElement) {
            return
        }
        const anchorElement = document.getElementById(tooltipElement.anchor)
        let showTimeoutHandler
        anchorElement.addEventListener("mouseover", () => {
            showTimeoutHandler = setTimeout(() => {
                tooltipElement.open = true
            }, timeout)
        })
        anchorElement.addEventListener("mouseout", () => {
            clearTimeout(showTimeoutHandler)
            tooltipElement.open = false
        })
    }, 0)