import * as alt from 'alt-server';
import { Character, Vehicle } from '@Shared/types/index.js';
import { useRebar } from '../index.js';

type DataTypes = {
    Character: keyof Character;
    Vehicle: keyof Vehicle;
};

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

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
        Rebar.document.character
            .useCharacterEvents()
            .on(key, (entity, newValue) => handleKeySet(entity, key, newValue));
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
        Rebar.document.vehicle.useVehicleEvents().on(key, (entity, newValue) => handleKeySet(entity, key, newValue));
    }

    return {
        syncCharacterKey,
        syncVehicleKey,
    };
}

RebarEvents.on('character-bound', (player, document) => {
    for (let key of keys.Character) {
        handleKeySet(player, key, document[key]);
    }
});

RebarEvents.on('vehicle-bound', (vehicle, document) => {
    for (let key of keys.Vehicle) {
        handleKeySet(vehicle, key, document[key]);
    }
});
