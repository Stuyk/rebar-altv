import * as alt from 'alt-server';
/**
 * Decorator for listening to RPC (Remote Procedure Call) methods on the client side.
 * @param {string} eventName  The event name to listen to.
 * @param {Object} [opts]  Additional options.
 * @param {Array<{ func: Function; onErrorMessage?: string }>} [opts.checkers]  An array of functions to check before executing the method.
 * @returns  {Function}  The decorator function.
 *
 * @example
 * ```ts
 * function isPlayerLoggedIn(player: alt.Player) {
 *    return player.getMeta('loggedIn');
 * }
 * //  Usage in Class
 * class Auth {
 *     \@rpcOnClient('auth:login')
 *     async login(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *         // Login logic
 *         return { success: true, characters: []}
 *     }
 *     \@rpcOnClient('auth:login:other', { checkers: [{ func: isPlayerLoggedIn, onErrorMessage: 'You are already logged in!' }] })
 *     async loginOther(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *         // Login logic
 *         return { success: true, characters: []}
 *     }
 * }
 * //  Usage in Function
 * rpcOnClient('auth:login')(login)
 * rpcOnClient('auth:login', { checkers: [ {func: isPlayerLoggedIn, onErrorMessage: 'You are already logged in!'}] })(login)
 *
 * async function login(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *    // Login logic
 *    return { success: true, characters: []}
 * }
 * ```
 */
export function rpcOnClient(
    eventName: string,
    opts?: { checkers?: Array<{ func: Function; onErrorMessage?: string }> }
) {
    alt.log('Invoked on rpc client');
    return function (target?: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        if (!propertyKey || !descriptor) {
            // descriptor.value = target;
            descriptor = { value: target };
        }
        const originalMethod = descriptor.value;
        alt.onClient(eventName, async (player, id, ...args) => {
            if (opts?.checkers) {
                for (const checker of opts.checkers) {
                    if (!checker.func(player)) {
                        alt.emitClient(
                            player,
                            `${eventName}-${id}`,
                            alt.debug ? { error: checker.onErrorMessage } : { error: 'An error occurred' }
                        );
                        return;
                    }
                }
            }

            try {
                const result = await originalMethod.apply(target, [player, ...args]);
                alt.emitClient(player, `${eventName}-${id}`, result);
            } catch (error) {
                if (alt.debug) {
                    alt.logDebug(`Error in rpcOnClient ${eventName}-${id}: ${error}`);
                }
                alt.emitClient(
                    player,
                    `${eventName}-${id}`,
                    alt.debug ? { error: error } : { error: 'An error occurred' }
                );
            }
        });
    };
}

/**
 *  Emit data to the client with RPC (Remote Procedure Call)
 * @param {alt.Player} player The player to emit the data to.
 * @param {string} eventName The event name to emit.
 * @param {number} timeoutMs The timeout in milliseconds.
 * @param args The arguments to pass to the client.
 * @returns {Promise<T>} The promise that resolves with the data from the client.
 */
export async function rpcEmitClient<T>(
    player: alt.Player,
    eventName: string,
    timeoutMs: number = 5000,
    ...args: any[]
) {
    return new Promise<T>((resolve, reject) => {
        let resolved = false;
        const id = alt.setTimeout(() => {
            if (!resolved) reject('Timeout');
        }, timeoutMs);

        alt.emitClient(player, eventName, id, ...args);

        alt.onceClient(`${eventName}-${id}`, (ply: alt.Player, data: T) => {
            if (player.id !== ply.id) return;
            resolved = true;
            resolve(data);
            try {
                alt.clearTimeout(id);
            } catch {}
        });
    });
}

/**
 * Decorator for listening to RPC (Remote Procedure Call) methods on the webview.
 * @param {string} eventName  The event name to listen to.
 * @param {Object} [opts]  Additional options.
 * @param {Array<{ func: Function; onErrorMessage?: string }>} [opts.checkers]  An array of functions to check before executing the method.
 * @returns  {Function}  The decorator function.
 *
 * @example
 * ```ts
 * function isPlayerLoggedIn(player: alt.Player) {
 *    return player.getMeta('loggedIn');
 * }
 * //  Usage in Class
 * class Auth {
 *     \@rpcOnView('auth:login')
 *     async login(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *         // Login logic
 *         return { success: true, characters: []}
 *     }
 *     \@rpcOnView('auth:login:other', { checkers: [{ func: isPlayerLoggedIn, onErrorMessage: 'You are already logged in!' }] })
 *     async loginOther(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *         // Login logic
 *         return { success: true, characters: []}
 *     }
 * }
 * //  Usage in Function
 * rpcOnView('auth:login')(login)
 * rpcOnView('auth:login', { checkers: [ {func: isPlayerLoggedIn, onErrorMessage: 'You are already logged in!'}] })(login)
 *
 * async function login(player: alt.Player, email: string, password: string, rememberMe: boolean) {
 *    // Login logic
 *    return { success: true, characters: []}
 * }
 * ```
 */
export function rpcOnView(eventName: string, opts?: { checkers?: Array<{ func: Function; onErrorMessage?: string }> }) {
    return function (target?: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        if (!propertyKey || !descriptor) {
            // descriptor.value = target;
            descriptor = { value: target };
        }
        const originalMethod = descriptor.value;
        alt.onClient(eventName, async (player, id, ...args) => {
            console.log('Invoked on rpc view', eventName);
            if (opts?.checkers) {
                for (const checker of opts.checkers) {
                    if (!checker.func(player)) {
                        alt.emitClient(
                            player,
                            `webview-${eventName}-${id}`,
                            alt.debug ? { error: checker.onErrorMessage } : { error: 'An error occurred' }
                        );
                        return;
                    }
                }
            }

            try {
                const result = await originalMethod.apply(target, [player, ...args]);
                alt.emitClient(player, `webview-${eventName}-${id}`, result);
            } catch (error) {
                if (alt.debug) {
                    alt.logDebug(`Error in rpcOnClient ${eventName}-${id}: ${error}`);
                }
                alt.emitClient(
                    player,
                    `webview-${eventName}-${id}`,
                    alt.debug ? { error: error } : { error: 'An error occurred' }
                );
            }
        });
    };
}

/**
 *  Emit data to the webview with RPC (Remote Procedure Call)
 * @param {alt.Player} player  The player to emit the data to.
 * @param {string} eventName  The event name to emit.
 * @param {number} timeoutMs  The timeout in milliseconds.
 * @param args  The arguments to pass to the client.
 * @returns {Promise<T>}  The promise that resolves with the data from the client.
 */
export async function rpcEmitView<T>(player: alt.Player, eventName: string, timeoutMs: number = 5000, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
        let resolved = false;
        const id = alt.setTimeout(() => {
            if (!resolved) reject('Timeout');
        }, timeoutMs);

        alt.emitClient(player, 'view:request:rpc:sendView', eventName, id, ...args);

        alt.onceClient(`webview-${eventName}-${id}`, (ply: alt.Player, data: T) => {
            if (player.id !== ply.id) return;
            resolved = true;
            resolve(data);
            try {
                alt.clearTimeout(id);
            } catch {}
        });
    });
}
