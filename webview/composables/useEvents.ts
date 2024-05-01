import { Events } from '../../src/main/shared/events/index';

const OnEvents: { [key: string]: (...args: any[]) => void } = {};

let isInitialized = false;

function handleEmits(event: string, ...args: any[]) {
    if (!OnEvents[event]) {
        console.warn(`[Webview] Event ${event}, has no callback`);
        return;
    }

    OnEvents[event](...args);
}

export function useEvents() {
    if (!isInitialized && 'alt' in window) {
        isInitialized = true;
        alt.on(Events.view.onEmit, handleEmits);
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
     * Emit an event to the client and wait for a response.
     * @param eventName  The event name to emit.
     * @param timeoutMs  The timeout in milliseconds.
     * @param args  The arguments to pass to the client.
     * @returns  The promise that resolves with the data from the client.
     */
    function emitRpcClient<T>(eventName: string, timeoutMs: number = 5000, ...args: any[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!('alt' in window)) {
                console.log(`[Webview] To Client Mock: ${eventName} | Args: ${JSON.stringify(args)}`);
                return;
            }

            let resolved = false;
            const id = setTimeout(() => {
                if (!resolved) reject('Timeout');
            }, timeoutMs);

            alt.emit(eventName, id, ...args);

            alt.once(`${eventName}-${id}`, (data: T) => {
                resolved = true;
                resolve(data);
                try {
                    clearTimeout(id);
                } catch {}
            });
        });
    }

    /**
     * Listen to RPC (Remote Procedure Call) methods on the client side.
     * @param eventName  The event name to listen for.
     */
    function onRpcClient(eventName: string) {
        return function (target?: Object, propertyKey?: string, descriptor?: PropertyDescriptor) {
            if (!propertyKey || !descriptor) {
                descriptor = { value: target };
            }

            const originalMethod = descriptor.value;
            alt.on(eventName, async (id, ...args) => {
                try {
                    const result = await originalMethod.apply(target, args);
                    alt.emit(`${eventName}-${id}`, result);
                } catch (error) {
                    alt.emit(`${eventName}-${id}`, { error });
                }
            });
        };
    }

    /**
     * Emit an event to the server and wait for a response.
     * @param eventName  The event name to emit.
     * @param timeoutMs  The timeout in milliseconds.
     * @param args  The arguments to pass to the server.
     * @returns  {Promise<T>} The promise that resolves with the data from the server.
     */
    function emitRpcToServer<T>(eventName: string, timeoutMs: number = 5000, ...args: any[]) {
        return new Promise<T>((resolve, reject) => {
            if (!('alt' in window)) {
                console.log(`[Webview] To Server Mock: ${eventName} | Args: ${JSON.stringify(args)}`);
                return;
            }

            let resolved = false;
            const id = setTimeout(() => {
                if (!resolved) reject('Timeout');
            }, timeoutMs);
            const eventId = `${eventName}-rpc-server-${id}`;

            alt.emit('view:request:rpc:sendServer', eventName, eventId, ...args);

            alt.once(`webview-${eventName}-${eventId}`, (data: T) => {
                resolved = true;
                resolve(data);
                try {
                    clearTimeout(id);
                } catch {}
            });
        });
    }
    /**
     * Listen to RPC (Remote Procedure Call) methods on the server side.
     * @param eventName The event name to listen for.
     */
    function onRpcServer(eventName: string) {
        return function (target?: Object, propertyKey?: string, descriptor?: PropertyDescriptor) {
            if (!propertyKey || !descriptor) {
                descriptor = { value: target };
            }

            const originalMethod = descriptor.value;
            alt.on(eventName, async (id, ...args) => {
                try {
                    const result = await originalMethod.apply(target, args);
                    alt.emit(`${eventName}-${id}`, result);
                } catch (error) {
                    alt.emit(`${eventName}-${id}`, { error });
                }
            });
        };
    }

    return {
        emitClient,
        emitServer,
        on,
        onRpcClient,
        onRpcServer,
        emitRpcClient,
        emitRpcToServer,
    };
}
