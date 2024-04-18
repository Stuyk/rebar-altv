import { Events } from '../../src/main/shared/events';
import { usePages } from './usePages';

let isInitialized = false;

const { hide, show, hideAllByType } = usePages();

function hidePages(pageNames: string[]) {
    for (let pageName of pageNames) {
        hide(pageName);
    }
}

export function usePageEvents() {
    function init() {
        if (isInitialized) {
            return;
        }

        if (!('alt' in window)) {
            return;
        }

        alt.on(Events.view.show, show);
        alt.on(Events.view.hide, hide);
        alt.on(Events.view.hideAll, hidePages);
        alt.on(Events.view.hideAllByType, hideAllByType);

        isInitialized = true;
    }

    return { init };
}
