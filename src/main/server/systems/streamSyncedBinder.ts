import * as alt from 'alt-server';
import { Character, Vehicle } from '@Shared/types/index.js';

type DataTypes = {
    Character: keyof Character;
    Vehicle: keyof Vehicle;
};

const keys: { [K in keyof DataTypes]: DataTypes[K][] } = {
    Character: [],
    Vehicle: [],
};

function handleKeySet(entity: alt.Entity, key: string, newValue: any) {
    entity.setStreamSyncedMeta(key, newValue);
}

export function useStreamSyncedBinder() {
    /**
     * Automatically synchronize a character document property to the attached player
     *
     * @template K
     * @param {K} key
     * @return
     */
    function syncCharacterKey<K extends keyof Character>(key: K) {
        const index = keys.Character.findIndex((x) => x === key);
        if (index >= 0) {
            return;
        }

        keys.Character.push(key);
    }

    /**
     * Automatically synchronize a vehicle document property to the attached vehicle
     *
     * @template K
     * @param {K} key
     * @return
     */
    function syncVehicleKey<K extends keyof Vehicle>(key: K) {
        const index = keys.Vehicle.findIndex((x) => x === key);
        if (index >= 0) {
            return;
        }

        keys.Vehicle.push(key);
    }

    return {
        syncCharacterKey,
        syncVehicleKey,
    };
}

alt.on('rebar:playerCharacterBound', (player, document) => {
    for (let key of keys.Character) {
        handleKeySet(player, key, document[key]);
    }
});

alt.on('rebar:vehicleBound', (vehicle, document) => {
    for (let key of keys.Vehicle) {
        handleKeySet(vehicle, key, document[key]);
    }
});

alt.on('rebar:vehicleUpdated', (vehicle, key, value) => {
    if (keys.Vehicle.findIndex((x) => key == x) <= -1) {
        return;
    }

    handleKeySet(vehicle, key, value);
});

alt.on('rebar:playerCharacterUpdated', (player, key, value) => {
    if (keys.Character.findIndex((x) => key == x) <= -1) {
        return;
    }

    handleKeySet(player, key, value);
});
