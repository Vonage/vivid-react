/**
* Patches provided VwcBadge instance to show text in the center
*
* @param {HTMLElement} badgeElement - target element to apply behavior to
* @example <VwcBadge ref={vwcBadgeShowTextCenterDecorator()} />
*/
export const vwcBadgeShowTextCenterDecorator = () => badgeElement =>
    setTimeout(() => {
        if (!badgeElement) {
            return
        }
        
        if (badgeElement.shadowRoot) {
            const span = badgeElement.shadowRoot.querySelector('span.base');
            if (span) {
                span.style.display = 'flex';
                span.style.justifyContent = 'center';
            }
        }
    }, 0)
