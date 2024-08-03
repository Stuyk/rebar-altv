import * as alt from 'alt-client';
import {Character, Vehicle} from '@Shared/types/index.js';

export function useStreamSyncedGetter() {
    /**
     * Get synced data from `streamedSyncedBinder` if it is available for a given vehicle
     *
     * @param {alt.Vehicle} vehicle
     * @return
     */
    function vehicle(vehicle: alt.Vehicle) {
        function has<K extends keyof Vehicle>(key: K): boolean {
            return vehicle.hasStreamSyncedMeta(key);
        }

        function get<K extends keyof Vehicle>(key: K): Vehicle[K] {
            return vehicle.getStreamSyncedMeta(key) as Vehicle[K];
        }

        return {
            has,
            get,
        };
    }

    /**
     * Get synced data from `streamedSyncedBinder` if it is available for a given player
     *
     * @param {alt.Player} player
     * @return
     */
    function player(player: alt.Player) {
        function has<K extends keyof Character>(key: K): boolean {
            return player.hasStreamSyncedMeta(key);
        }

        function get<K extends keyof Character>(key: K): Character[K] {
            return player.getStreamSyncedMeta(key) as Character[K];
        }

        return {
            has,
            get,
        };
    }

    return {
        player,
        vehicle,
    };
}
