import * as alt from 'alt-client';
import * as View from '@Client/webview/index.js';

/**
 * Decorator for listening to RPC (Remote Procedure Call) methods on the server side.
 * @param {string} eventName  The event name to listen to.
 * @param {Object} [opts]  Additional options.
 * @param {Array<{ func: Function; onErrorMessage?: string }>} [opts.checkers]  An array of functions to check before executing the method.
 * @returns  {Function}  The decorator function.
 *
 * @example
 * ```ts
 * function isAnyPageOpen() {
 *  return openPages.length > 0;
 * }
 *
 * //  Usage in Class
 * class Auth {
 *    \@rpcOnServer('auth:login:start')
 *     async loginStart(player: alt.Player) {
 *      // Login logic
 *     return { success: true }
 *    }
 *     \@rpcOnServer('auth:login:other', { checkers: [{ func: isAnyPageOpen, onErrorMessage: 'You have a page open!' }] })
 *    async loginOther(player: alt.Player) {
 *     // Login logic
 *      return true
 *    }
 * }
 *
 * //  Usage in Function
 * rpcOnServer('auth:login:start')(loginStart)
 * rpcOnServer('auth:login:start', { checkers: [ {func: isAnyPageOpen, onErrorMessage: 'You have a page open!'}] })(loginStart)
 *
 * async function loginStart(player: alt.Player) {
 *   // Login logic
 *  return true
 * }
 * ```
 */
export function rpcOnServer(
    eventName: string,
    opts?: { checkers?: Array<{ func: Function; onErrorMessage?: string }> }
) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        alt.onServer(eventName, async (id, ...args) => {
            if (opts?.checkers) {
                for (const checker of opts.checkers) {
                    if (!checker.func()) {
                        alt.emitServer(
                            `${eventName}-${id}`,
                            alt.debug ? { error: checker.onErrorMessage } : { error: 'An error occurred' }
                        );
                        return;
                    }
                }
            }
            try {
                const result = await originalMethod.apply(target, args);
                alt.emitServer(`${eventName}-${id}`, result);
            } catch (error) {
                if (alt.debug) {
                    alt.logDebug(`Error in rpcOnServer ${eventName}-${id}: ${error}`);
                }
                alt.emitServer(`${eventName}-${id}`, alt.debug ? { error: error } : { error: 'An error occurred' });
            }
        });
    };
}

/**
 * Decorator for emitting RPC (Remote Procedure Call) methods to the server side.
 * @param {string} eventName The event name to emit.
 * @param {number} timeoutMs The timeout in milliseconds.
 * @param args  The arguments to pass to the server.
 * @returns {Promise<T>} The promise that resolves with the data from the server.
 */
export async function rpcEmitServer<T>(eventName: string, timeoutMs: number = 5000, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
        let resolved = false;
        const id = alt.setTimeout(() => {
            if (!resolved) reject('Timeout');
        }, timeoutMs);

        alt.emitServer(eventName, id, ...args);

        alt.onceServer(`${eventName}-${id}`, (data: T) => {
            resolved = true;
            resolve(data);
            return;
        });
    });
}

/**
 * Decorator for listening to RPC (Remote Procedure Call) methods on the client side from webview.
 * @param eventName  The event name to listen to.
 * @param opts  Additional options.
 * @returns The decorator function.
 *
 * @example
 * ```ts
 * function isNearTheObject(objectName: string) {
 * // Check if the player is near the object
 * return true
 * }
 *
 * // Usage in Class
 * class GasStation {
 *  \@rpcOnView('gasstation:fill:start')
 *  async fillStart(player: alt.Player) {
 *      // Fill logic
 *     return { success: true }
 *  }
 *
 *  \@rpcOnView('gasstation:fill:other', { checkers: [{ func: isNearTheObject, onErrorMessage: 'You are not near the object!' }] })
 *  async fillOther(player: alt.Player) {
 *     // Fill logic
 *     return true
 *  }
 * }
 *
 * // Usage in Function
 * rpcOnView('gasstation:fill:start')(fillStart)
 * rpcOnView('gasstation:fill:start', { checkers: [ {func: isNearTheObject, onErrorMessage: 'You are not near the object!'}] })(fillStart)
 *
 * async function fillStart(player: alt.Player) {
 *    // Fill logic
 *   return true
 * }
 */
export function rpcOnView(eventName: string, opts?: { checkers?: Array<{ func: Function; onErrorMessage?: string }> }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        alt.on(eventName, async (id, ...args) => {
            if (opts?.checkers) {
                for (const checker of opts.checkers) {
                    if (!checker.func()) {
                        alt.emit(
                            `${eventName}-${id}`,
                            alt.debug ? { error: checker.onErrorMessage } : { error: 'An error occurred' }
                        );
                        return;
                    }
                }
            }
            try {
                const result = await originalMethod.apply(target, args);
                alt.emit(`${eventName}-${id}`, result);
            } catch (error) {
                if (alt.debug) {
                    alt.logDebug(`Error in rpcOnView ${eventName}-${id}: ${error}`);
                }
                alt.emit(`${eventName}-${id}`, alt.debug ? { error: error } : { error: 'An error occurred' });
            }
        });
    };
}

/**
 *  Decorator for emitting RPC (Remote Procedure Call) methods to the client side from webview.
 * @param {string} eventName The event name to emit.
 * @param {number} timeoutMs The timeout in milliseconds.
 * @param args  The arguments to pass to the client.
 * @returns { Promise<T>} The promise that resolves with the data from the client.
 */
export async function rpcEmitView<T>(eventName: string, timeoutMs: number, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
        let resolved = false;
        const _timeout = alt.setTimeout(() => {
            if (!resolved) reject('Timeout');
        }, timeoutMs);
        const id = `${eventName}-client-${_timeout}`;
        View.useWebview().emit(eventName, ...args);

        View.useWebview().on(id, (data: T) => {
            resolved = true;
            resolve(data);
            try {
                alt.clearTimeout(_timeout);
            } catch {}
            View.useWebview().off(id);
        });
    });
}
