import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '@Shared/events/index.js';
import { PageNames, PageType } from '@Shared/webview/index.js';

type AnyCallback = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>) | Function;

const ClientEvents: { [eventName: string]: AnyCallback } = {};
const ClientRpcEvents: { [eventName: string]: (...args: any[]) => Promise<any> | any } = {}

let onWebviewReadyCallbacks: (() => void)[] = [];
let readyCallbackTimeout;
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

async function handleFrontendSound(audioName: string, audioRef: string, audioBank = '') {
    if (audioBank !== '') {
        native.requestScriptAudioBank(audioBank, false, -1);
    }

    native.playSoundFrontend(-1, audioName, audioRef, true);
}

function processReadyCallbacks() {
    for (let cb of onWebviewReadyCallbacks) {
        cb();
    }

    onWebviewReadyCallbacks = [];
}

export function useWebview(path = 'http://assets/webview/index.html') {
    let isInitialized = true;

    if (!webview) {
        isInitialized = false;
        webview = new alt.WebView(path);
        webview.unfocus();
        webview.on(Events.view.playFrontendSound, handleFrontendSound);
        alt.on('keyup', emitKeypress);
    }

    /**
     * Emits key presses to the webview
     *
     * @param {number} key
     */
    function emitKeypress(key: number) {
        webview.emit(Events.view.onKeypress, key);
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
        webview.emit(Events.view.show, vueName, type);

        if (type === 'page') {
            focus();
            isPageOpen = true;
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
        webview.emit(Events.view.hide, vueName);
        unfocus();

        // Only remove 'page' types
        const index = openPages.findIndex((page) => page === vueName);
        if (index > -1) {
            isPageOpen = false;
            openPages.splice(index, 1);
        }
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

    /**
     * This will only be called once, and the callback will be delayed by roughly 5s
     *
     * @param {() => void} callback
     */
    function onWebviewReady(callback: () => void) {
        if (readyCallbackTimeout) {
            alt.clearTimeout(readyCallbackTimeout);
        }

        alt.setTimeout(processReadyCallbacks, 2500);
        onWebviewReadyCallbacks.push(callback);
    }

    /**
     * Get something from the local alt storage
     *
     * @param {string} key 
     */
    function getLocalStorage(key: string) {
        const data = alt.LocalStorage.get(key);
        webview.emit(Events.view.localStorageGet, key, data)
    }

    /**
     * Set data to the local alt storage
     *
     * @param {string} key 
     * @param {*} value 
     */
    function setLocalStorage(key: string, value: any) {
        alt.LocalStorage.set(key, value);
        alt.LocalStorage.save();
    }

    /**
     * Delete something from local storage
     *
     * @param {string} key 
     */
    function deleteLocalStorage(key: string) {
        alt.LocalStorage.delete(key);
        alt.LocalStorage.save();
    }

    async function handleServerRpcEvent(event: string, ...args: any[]) {
        const result = await alt.emitRpc(event, ...args);
        webview.emit(Events.view.emitServerRpc, event, result);
    }

    /**
     * Handles client RPC events, and returns results
     *
     * @param {string} event 
     * @param {...any[]} args 
     * @return 
     */
    async function handleClientRpcEvent(event: string, ...args: any[]) {
        if (!ClientRpcEvents[event]) {
            alt.logWarning(`No Client RPC Event for ${event}`)
            webview.emit(Events.view.emitClientRpc, event, undefined);
            return;
        }

        const result = await ClientRpcEvents[event](...args);
        webview.emit(Events.view.emitClientRpc, event, result);
    }

    /**
     * Listen for an event from the webview, and return a result to the RPC
     *
     * @param {string} event 
     * @param {(...args: any[]) => void} callback 
     */
    function onRpc(event: string, callback: (...args: any[]) => void) {
        ClientRpcEvents[event] = callback;
    }

    if (!isInitialized) {
        alt.onServer(Events.view.focus, focus);
        alt.onServer(Events.view.unfocus, unfocus);
        alt.onServer(Events.view.hide, hide);
        alt.onServer(Events.view.show, show);
        alt.onServer(Events.view.onServer, emit);
        webview.on(Events.view.localStorageGet, getLocalStorage);
        webview.on(Events.view.localStorageSet, setLocalStorage);
        webview.on(Events.view.localStorageDelete, deleteLocalStorage);
        webview.on(Events.view.emitClient, handleClientEvent);
        webview.on(Events.view.emitServer, handleServerEvent);
        webview.on(Events.view.emitServerRpc, handleServerRpcEvent);
        webview.on(Events.view.emitClientRpc, handleClientRpcEvent);
    }

    return {
        emit,
        hide,
        hideAll,
        hideAllByType,
        off,
        on,
        onRpc,
        onWebviewReady,
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
