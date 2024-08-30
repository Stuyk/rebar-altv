import * as alt from 'alt-server';
import * as native from 'natives';
import { Events } from '@Shared/events/index.js';

export function useNative(player: alt.Player) {
    /**
     * Invoke a native from server-side that a client will invoke on their side
     *
     * @template T
     * @param {T} nativeName
     * @param {...Parameters<(typeof native)[T]>} args
     * @return
     */
    function invoke<T extends keyof typeof native>(nativeName: T, ...args: Parameters<(typeof native)[T]>) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.native.invoke, nativeName, ...args);
    }

    /**
     * Invoke many natives at once from server-side that a client will invoke on their side
     *
     * @template T
     * @param {{ native: T; args: Parameters<(typeof native)[T]> }[]} natives
     */
    function invokeMany<T extends keyof typeof native>(natives: { native: T; args: Parameters<(typeof native)[T]> }[]) {
        for (let nativeData of natives) {
            player.emit(Events.player.native.invoke, nativeData.native, ...nativeData.args);
        }
    }

    async function invokeWithResult<T extends keyof typeof native>(
        nativeName: T,
        ...args: Parameters<(typeof native)[T]>
    ) {
        return player.emitRpc(Events.player.native.invokeWithResult, nativeName, ...args);
    }

    return {
        invoke,
        invokeMany,
        invokeWithResult,
    };
}
