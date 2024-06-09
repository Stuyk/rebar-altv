import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';

type ReturnTypes = {
    player: alt.Player;
    vehicle: alt.Vehicle;
    object: alt.Object;
};

export function useRaycast(player: alt.Player) {
    /**
     * Returns the entity the player is looking at, or `undefined`.
     *
     * @template K
     * @param {K} type
     * @return {Promise<ReturnTypes[K]>}
     */
    async function getFocusedEntity<K extends keyof ReturnTypes>(
        type: K,
        debug = false,
    ): Promise<ReturnTypes[K] | undefined> {
        return await player.emitRpc(Events.systems.raycast.getFocusedEntity, type, debug);
    }

    /**
     * Get a world object the player may be looking at.
     *
     * **Keep in mind that `scriptId` is not the same for every player**
     *
     * @return {Promise<{ pos: alt.Vector3; scriptId: number; model: number, entityPos: alt.Vector3 }>}
     */
    async function getFocusedObject(
        debug = false,
    ): Promise<{ pos: alt.Vector3; scriptId: number; model: number; entityPos: alt.Vector3 } | undefined> {
        return await player.emitRpc(Events.systems.raycast.getFocusedObject, debug);
    }

    async function getFocusedPosition(debug = false): Promise<alt.Vector3 | undefined> {
        return await player.emitRpc(Events.systems.raycast.getFocusedPosition, debug);
    }

    return {
        getFocusedEntity,
        getFocusedObject,
        getFocusedPosition,
    };
}
