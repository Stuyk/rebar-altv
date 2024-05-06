import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import { PageNames, PageType } from '@Shared/webview/index.js';
import { PageInfo } from '@Shared/types/webview.js';

const SessionKeys = {
    WebviewPage: 'webview:page',
    WebviewOverlays: 'webview:overlays',
    WebviewPersistent: 'webview:persistent',
};

export function useWebview(player: alt.Player) {
    function emit(eventName: string, ...args: any[]) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.onServer, eventName, ...args);
    }

    function show(vuePage: PageNames, type: PageType) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.show, vuePage, type);
    }

    function hide(vuePage: PageNames) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.hide, vuePage, 'page');
    }

    function focus() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.focus);
    }

    function unfocus() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.unfocus);
    }

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
                    type === 'persistent' ? SessionKeys.WebviewPersistent : SessionKeys.WebviewOverlays
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
    player.setMeta(SessionKeys.WebviewPage, pageName)
);

alt.onClient(Events.player.webview.set.overlays, (player, pageName: PageInfo[]) =>
    player.setMeta(SessionKeys.WebviewOverlays, pageName)
);

alt.onClient(Events.player.webview.set.persistent, (player, pageName: PageInfo[]) =>
    player.setMeta(SessionKeys.WebviewPersistent, pageName)
);
