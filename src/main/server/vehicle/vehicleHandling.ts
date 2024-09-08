import { HandlingData } from 'alt-client';
import * as alt from 'alt-server';

declare module 'alt-shared' {
    export interface ICustomEntityStreamSyncedMeta {
        handling: Partial<HandlingData>;
    }
}

export function useVehicleHandling(vehicle: alt.Vehicle) {
    let handlingData: Partial<HandlingData>;

    function set(data: Partial<HandlingData>) {
        handlingData = data;
        vehicle.setStreamSyncedMeta('handling', handlingData);
    }

    function get(): Partial<HandlingData | undefined> {
        return vehicle.getStreamSyncedMeta('handling');
    }

    function setPartial(data: Partial<HandlingData>) {
        if (!handlingData) {
            handlingData = data;
            return;
        }

        handlingData = Object.assign(handlingData, data);
        vehicle.setStreamSyncedMeta('handling', handlingData);
    }

    return {
        set,
        get,
        setPartial,
    };
}
