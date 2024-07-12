import * as alt from 'alt-client';

alt.on('streamSyncedMetaChange', (vehicle: alt.BaseObject, key: string) => {
    if (key !== 'handling') {
        return;
    }

    if (!(vehicle instanceof alt.Vehicle)) {
        return;
    }

    vehicle.handling = Object.assign(vehicle.handling, vehicle.getStreamSyncedMeta('handling'));
});

alt.on('enteredVehicle', (vehicle, seat) => {
    if (!vehicle.hasStreamSyncedMeta('handling')) {
        return;
    }

    vehicle.handling = Object.assign(vehicle.handling, vehicle.getStreamSyncedMeta('handling'));
});
