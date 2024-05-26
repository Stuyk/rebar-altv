import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';

export function useWaypoint(player: alt.Player) {
    async function get() {
        return await player.emitRpc(Events.systems.waypoint.get);
    }

    return {
        get,
    };
}
