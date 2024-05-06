import { ref } from 'vue';
import { PageType } from '../../src/main/shared/webview/index';
import { useEvents } from './useEvents';
import { Events } from '../../src/main/shared/events';
import { PageInfo } from '../../src/main/shared/types/webview';

const events = useEvents();
const pagesPersistent = ref<PageInfo[]>([]);
const pagesOverlay = ref<PageInfo[]>([]);
const page = ref<string | undefined>();

function toggleByType(type: PageType, value: boolean) {
    if (type === 'page') {
        return;
    }

    const target = type === 'persistent' ? pagesPersistent : pagesOverlay;
    for (let pageRef of target.value) {
        pageRef.visible = value;
    }
}

function updatePages(type: PageType) {
    switch (type) {
        case 'page':
            events.emitServer(Events.player.webview.set.page, page.value);
            break;
        case 'overlay':
            events.emitServer(Events.player.webview.set.overlays, pagesOverlay.value);
            break;
        case 'persistent':
            events.emitServer(Events.player.webview.set.persistent, pagesPersistent.value);
            break;
    }
}

export function usePages() {
    /**
     * Initialize the composables
     *
     */
    function init() {
        pagesPersistent.value = [];
        pagesOverlay.value = [];
        console.log(`Webview Page Composable Started`);
    }

    /**
     * Hide all pages for a given type
     *
     * @param {PageType} type
     */
    function hideAllByType(type: PageType) {
        if (type === 'page') {
            page.value = undefined;
            updatePages(type);
            return;
        }

        toggleByType(type, false);
        updatePages(type);
    }

    /**
     * Hide a specific page for a given type
     *
     * @param {PageType} type
     * @param {string} pageName
     * @return
     */
    function hide(pageName: string) {
        if (page.value === pageName) {
            page.value = undefined;
            toggleByType('overlay', true);
            events.emitServer(Events.player.webview.set.page, undefined);
            updatePages('page');
            return;
        }

        for (let pageRef of pagesPersistent.value) {
            if (pageRef.name != pageName) {
                continue;
            }

            pageRef.visible = false;
            updatePages('persistent');
            break;
        }

        for (let pageRef of pagesOverlay.value) {
            if (pageRef.name != pageName) {
                continue;
            }

            pageRef.visible = false;
            updatePages('overlay');
            break;
        }
    }

    /**
     * Show a specific page for a given type
     *
     * @param {PageType} pageType
     * @param {string} pageName
     */
    function show(pageName: string, type: PageType) {
        if (type === 'page') {
            page.value = pageName;
            toggleByType('overlay', false);
            updatePages(type);
            return;
        }

        const target = type === 'persistent' ? pagesPersistent : pagesOverlay;
        const index = target.value.findIndex((x) => x.name === pageName);
        if (index <= -1) {
            target.value.push({ name: pageName, visible: true });
            updatePages(type);
            return;
        }

        target.value[index].visible = true;
        updatePages(type);
    }

    return {
        init,
        hide,
        hideAllByType,
        page,
        pagesPersistent,
        pagesOverlay,
        show,
    };
}
