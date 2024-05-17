import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { PageNames, PageType } from '@Shared/webview/index.js';

type AnyCallback = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>) | Function;

const ClientEvents: { [eventName: string]: AnyCallback } = {};

let webview: alt.WebView;
let cursorCount: number = 0;
let isPageOpen = false;
let openPages: PageNames[] = [];

function handleServerEvent(event: string, ...args: any[]) {
    alt.emitServer(event, ...args);
}

function handleClientEvent(event: string, ...args: any[]) {
    if (!ClientEvents[event]) {
        console.warn(`[Client] Event '${event}' does not have a callback`);
        return;
    }

    ClientEvents[event](...args);
}

export function useWebview(path = 'http://assets/webview/index.html') {
    let isInitialized = true;

    if (!webview) {
        webview = new alt.WebView(path);
        webview.unfocus();
        isInitialized = false;
    }

    /**
     * Emit data to the Webview
     *
     * @param {string} event
     * @param {...any[]} args
     */
    function emit(event: string, ...args: any[]) {
        webview.emit(Events.view.onEmit, event, ...args);
    }

    /**
     * Handle a client event from the Webview
     *
     * @template EventNames
     * @param {EventNames} eventName
     * @param {AnyCallback} cb
     * @return
     */
    function on<EventNames = string>(eventName: EventNames, cb: AnyCallback) {
        if (ClientEvents[String(eventName)]) {
            console.warn(`[Client] Duplicate Event Name ${eventName}`);
            return;
        }

        ClientEvents[String(eventName)] = cb;
    }

    /**
     * Remove a client event from the Webview
     *
     * @template EventNames
     * @param {EventNames} eventName
     * @return
     */
    function off<EventNames = string>(eventName: EventNames) {
        if (!ClientEvents[String(eventName)]) {
            return;
        }

        delete ClientEvents[String(eventName)];
    }

    /**
     * Show a cursor for the Webview
     *
     * @param {boolean} state
     */
    function showCursor(state: boolean) {
        if (state) {
            cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {}
        } else {
            for (let i = 0; i < cursorCount; i++) {
                try {
                    alt.showCursor(false);
                } catch (err) {}
            }

            cursorCount = 0;
        }
    }

    /**
     * Show a page based on page name, and assign a type
     *
     * @param {PageNames} vueName
     * @param {PageType} type
     */
    function show(vueName: PageNames, type: PageType) {
        isPageOpen = true;
        webview.emit(Events.view.show, vueName, type);

        if (type === 'page') {
            focus();
            openPages.push(vueName);
        }
    }

    /**
     * Show the cursor to the player, and focus the webview instance
     */
    function focus() {
        webview.focus();
        showCursor(true);
    }

    /**
     * Remove the cursor on screen, and unfocus the webview instance
     */
    function unfocus() {
        webview.unfocus();
        showCursor(false);
    }

    /**
     * Hide a page based on page name.
     *
     * @param {PageNames} vueName
     */
    function hide(vueName: PageNames) {
        isPageOpen = false;
        webview.emit(Events.view.hide, vueName);
        unfocus();
        const index = openPages.findIndex((page) => page === vueName);
        if (index > -1) openPages.splice(index, 1);
    }

    /**
     * Hide all pages specified in this function
     *
     * @param {PageNames[]} vueNames
     */
    function hideAll(vueNames: PageNames[]) {
        webview.emit(Events.view.hideAll, vueNames);
    }

    /**
     * Hide all pages by type
     *
     * @param {PageType} type
     */
    function hideAllByType(type: PageType) {
        webview.emit(Events.view.hideAllByType, type);
    }

    /**
     * Check if specific page is open.
     *
     * @param {PageNames} vueName
     * @returns {boolean}
     */
    function isSpecificPageOpen(vueName: PageNames): boolean {
        return openPages.findIndex((page) => page === vueName) > -1;
    }

    if (!isInitialized) {
        alt.onServer(Events.view.focus, focus);
        alt.onServer(Events.view.unfocus, unfocus);
        alt.onServer(Events.view.hide, hide);
        alt.onServer(Events.view.show, show);
        alt.onServer(Events.view.onServer, emit);
        webview.on(Events.view.emitClient, handleClientEvent);
        webview.on(Events.view.emitServer, handleServerEvent);
    }

    return {
        emit,
        hide,
        hideAll,
        hideAllByType,
        off,
        on,
        focus,
        unfocus,
        showCursor,
        show,
        isSpecificPageOpen,
        isAnyPageOpen() {
            return isPageOpen;
        },
    };
}
