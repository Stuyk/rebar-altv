import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import { PageNames, PageType } from '@Shared/webview/index.js';

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

    return {
        emit,
        focus,
        hide,
        show,
        unfocus,
    };
}
