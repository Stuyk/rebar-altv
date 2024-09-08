import { Events } from '../../src/main/shared/events';
import { Ref, ref } from 'vue';
import { Vehicle } from '../../src/main/shared/types/vehicle.js';
import { Character } from '../../src/main/shared/types/character.js';

let isInit = false;

const character = ref<Partial<Character>>({});
const vehicle = ref<Partial<Vehicle>>({});

function syncCharacterData(data: Object) {
    for (let key of Object.keys(data)) {
        character.value[key] = data[key];
    }
}

function syncVehicleData(data: Object) {
    for (let key of Object.keys(data)) {
        vehicle.value[key] = data[key];
    }
}

export function useSyncedMeta() {
    function init() {
        if (isInit) {
            return;
        }

        isInit = true;
        if (!('alt' in window)) {
            return;
        }

        alt.on(Events.view.syncCharacter, syncCharacterData);
        alt.on(Events.view.syncVehicle, syncVehicleData);
        alt.on(Events.view.syncPartialCharacter, (key: string, data: any) => {
            character.value[key] = data;
        });
        alt.on(Events.view.syncPartialVehicle, (key: string, data: any) => (vehicle.value[key] = data));
    }

    return {
        init,
        getCharacter<T = {}>() {
            return character as Ref<T & Character>;
        },
        getVehicle<T = {}>() {
            return vehicle as Ref<T & Vehicle>;
        },
    };
}
