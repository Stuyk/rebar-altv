import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import { PageNames, PageType } from '@Shared/webview/index.js';
import {PageInfo} from '@Shared/types/index.js';

const SessionKeys = {
    WebviewPage: 'webview:page',
    WebviewOverlays: 'webview:overlays',
    WebviewPersistent: 'webview:persistent',
};

export function useWebview(player: alt.Player) {
    /**
     * Emit an event directly to the webview
     *
     * @param {string} eventName
     * @param {...any[]} args
     * @return
     */
    function emit(eventName: string, ...args: any[]) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.onServer, eventName, ...args);
    }

    /**
     * Show a specific webview page to the player.
     *
     * Assign the `type` of page to change how it behaves.
     *
     * Escape to close page, only effects page types.
     *
     * @param {PageNames} vuePage
     * @param {PageType} type
     * @param {boolean} [escapeToClosePage=false]
     * @return
     */
    function show(vuePage: PageNames, type: PageType, escapeToClosePage = false) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.show, vuePage, type, escapeToClosePage);
    }

    /**
     * Hide a page that was shown to the player
     *
     * @param {PageNames} vuePage
     * @return
     */
    function hide(vuePage: PageNames) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.hide, vuePage, 'page');
    }

    /**
     * Focus the webview, and show the cursor
     *
     * @return
     */
    function focus() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.focus);
    }

    /**
     * Unfocus the webview, and hide the cursor
     *
     * @return
     */
    function unfocus() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.unfocus);
    }

    /**
     * Verify if a page is currently ready
     *
     * @param {PageNames} pageName
     * @param {PageType} type
     * @return
     */
    async function isReady(pageName: PageNames, type: PageType) {
        if (type === 'page') {
            try {
                await alt.Utils.waitFor(() => player.getMeta(SessionKeys.WebviewPage) !== undefined, 5000);
                return true;
            } catch (err) {
                return false;
            }
        }

        try {
            await alt.Utils.waitFor(() => {
                const pages = player.getMeta(
                    type === 'persistent' ? SessionKeys.WebviewPersistent : SessionKeys.WebviewOverlays,
                ) as PageInfo[];

                const index = pages.findIndex((x) => x.name == pageName);
                if (index <= -1) {
                    return false;
                }

                return pages[index].visible;
            }, 5000);
            return true;
        } catch (err) {
            return false;
        }
    }

    return {
        emit,
        focus,
        hide,
        isReady,
        show,
        unfocus,
    };
}

alt.onClient(Events.player.webview.set.page, (player, pageName: string) =>
    player.setMeta(SessionKeys.WebviewPage, pageName),
);

alt.onClient(Events.player.webview.set.overlays, (player, pageName: PageInfo[]) =>
    player.setMeta(SessionKeys.WebviewOverlays, pageName),
);

alt.onClient(Events.player.webview.set.persistent, (player, pageName: PageInfo[]) =>
    player.setMeta(SessionKeys.WebviewPersistent, pageName),
);
