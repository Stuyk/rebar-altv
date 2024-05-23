import { Events } from '../../src/main/shared/events/index.js';

const OnEvents: { [key: string]: (...args: any[]) => void } = {};
const OnKeybind: { [identifier: string]: { key: number; callback: (...args: any[]) => void } } = {};

let isInitialized = false;

function handleEmits(event: string, ...args: any[]) {
    if (!OnEvents[event]) {
        if (event.includes('localplayer')) {
            return;
        }

        console.warn(`[Webview] Event ${event}, has no callback`);
        return;
    }

    OnEvents[event](...args);
}

function handleKeypress(keycode: number) {
    for (let value of Object.values(OnKeybind)) {
        if (value.key !== keycode) {
            continue;
        }

        value.callback(keycode);
    }
}

export function useEvents() {
    if (!isInitialized && 'alt' in window) {
        isInitialized = true;
        alt.on(Events.view.onEmit, handleEmits);
        alt.on(Events.view.onKeypress, handleKeypress);
    }

    /**
     * Emits an event that goes straight to the server.
     * Can be recieved with `alt.onClient`.
     *
     * @param {string} eventName
     * @param {...any[]} args
     * @return {void}
     *
     */
    function emitServer<EventNames = string>(eventName: EventNames, ...args: any[]): void {
        if (!('alt' in window)) {
            console.log(`[Webview] To Server Mock: ${eventName} | Args: ${JSON.stringify(args)}`);
            return;
        }

        alt.emit(Events.view.emitServer, eventName, ...args);
    }

    /**
     * Emits an event that goes to the client.
     *
     * Removes the need to do `on` and `off` events.
     *
     * @param {string} eventName
     * @param {...any[]} args
     * @return {void}
     *
     */
    function emitClient<EventNames = string>(eventName: EventNames, ...args: any[]): void {
        if (!('alt' in window)) {
            console.log(`[Webview] To Client Mock: ${eventName} | Args: ${JSON.stringify(args)}`);
            return;
        }

        alt.emit(Events.view.emitClient, eventName, ...args);
    }

    /**
     * Register an `on` event that gets called when
     * an event is emitted through WebViewController.
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} callback
     *
     */
    function on<EventNames = string, Callback = (...args: any[]) => void>(eventName: EventNames, callback: Callback);
    function on(eventName: string, callback: (...args: any[]) => void) {
        OnEvents[eventName] = callback;
    }

    /**
     * Register a callback that sends when a key bind is pressed.
     *
     * Used for advanced interface functionality. Great for overlays.
     *
     * @param {string} identifier
     * @param {number} key
     * @param {() => void} callback
     */
    function onKeyUp(identifier: string, key: number, callback: () => void) {
        OnKeybind[identifier] = {
            key,
            callback,
        };
    }

    return {
        emitClient,
        emitServer,
        on,
        onKeyUp,
    };
}
