import * as alt from 'alt-client';

alt.on('streamSyncedMetaChange', (vehicle: alt.BaseObject, key: string) => {
    if (key !== 'handling') {
        return;
    }

    if (!(vehicle instanceof alt.Vehicle)) {
        return;
    }
    const handlingData: Partial<alt.HandlingData> = vehicle.getStreamSyncedMeta('handling');

    vehicle.handling.reset();

    for (const [key, value] of Object.entries(handlingData)) {
        vehicle.handling[key] = value;
    }
});

alt.on('enteredVehicle', (vehicle, seat) => {
    if (!vehicle.hasStreamSyncedMeta('handling')) {
        return;
    }
    const handlingData: Partial<alt.HandlingData> = vehicle.getStreamSyncedMeta('handling');

    for (const [key, value] of Object.entries(handlingData)) {
        vehicle.handling[key] = value;
    }
});
