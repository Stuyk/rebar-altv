import { ref } from 'vue';
import { PageType } from '../../src/main/shared/webview/index';

type PageInfo = { name: string; visible: boolean };

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
            return;
        }

        toggleByType(type, false);
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
            return;
        }

        for (let pageRef of pagesPersistent.value) {
            if (pageRef.name != pageName) {
                continue;
            }

            pageRef.visible = false;
            break;
        }

        for (let pageRef of pagesOverlay.value) {
            if (pageRef.name != pageName) {
                continue;
            }

            pageRef.visible = false;
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
            return;
        }

        const target = type === 'persistent' ? pagesPersistent : pagesOverlay;
        const index = target.value.findIndex((x) => x.name === pageName);
        if (index <= -1) {
            target.value.push({ name: pageName, visible: true });
            return;
        }

        target.value[index].visible = true;
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
