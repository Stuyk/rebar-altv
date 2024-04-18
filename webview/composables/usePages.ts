import { ref } from 'vue';

type PageInfo = { name: string; visible: boolean };
type PageTypes = 'persistent' | 'dynamic';

const pagesPersistent = ref<PageInfo[]>([]);
const pagesDynamic = ref<PageInfo[]>([]);

export function usePages() {
    /**
     * Hide all pages for a given type
     *
     * @param {PageTypes} type
     */
    function hideAll(type: PageTypes) {
        const target = type === 'persistent' ? pagesPersistent : pagesDynamic;
        for (let page of target.value) {
            page.visible = false;
        }
    }

    /**
     * Hide a specific page for a given type
     *
     * @param {PageTypes} type
     * @param {string} pageName
     * @return
     */
    function hide(type: PageTypes, pageName: string) {
        const target = type === 'persistent' ? pagesPersistent : pagesDynamic;
        const index = target.value.findIndex((x) => x.name === pageName);
        if (index <= -1) {
            return;
        }

        target.value[index].visible = false;
    }

    /**
     * Register a component to be useable for loading in-game
     *
     * @param {PageTypes} type
     * @param {string} name
     * @return
     */
    function register(type: 'persistent' | 'dynamic', name: string) {
        const target = type === 'persistent' ? pagesPersistent : pagesDynamic;
        const index = target.value.findIndex((x) => x.name === name);
        if (index >= 0) {
            console.warn(`[Webview] ${name} is already registered`);
            return;
        }

        target.value.push({ name, visible: false });
    }

    /**
     * Show a specific page for a given type
     *
     * @param {PageTypes} pageType
     * @param {string} pageName
     */
    function show(type: PageTypes, pageName: string) {
        const target = type === 'persistent' ? pagesPersistent : pagesDynamic;
        const index = target.value.findIndex((x) => x.name === pageName);
        if (index <= -1) {
            return;
        }

        target.value[index].visible = true;
    }

    return {
        hide,
        hideAll,
        pagesPersistent,
        pagesDynamic,
        register,
        show,
    };
}
