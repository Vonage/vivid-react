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
