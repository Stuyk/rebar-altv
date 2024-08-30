import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';

function updateVehicleDoorState(vehicle: alt.Vehicle) {
    for (let i = 0; i <= 5; i++) {
        const state = vehicle.getStreamSyncedMeta(`door-${i}`) ? true : false;

        if (state) {
            native.setVehicleDoorOpen(vehicle, i, false, true);
        } else {
            native.setVehicleDoorShut(vehicle, i, true);
        }
    }
}

alt.on('streamSyncedMetaChange', (object: alt.BaseObject, key, value) => {
    if (!(object instanceof alt.Vehicle)) {
        return;
    }

    if (!key.includes('door')) {
        return;
    }

    updateVehicleDoorState(object);
});

alt.on('gameEntityCreate', (entity) => {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    updateVehicleDoorState(entity);
});

alt.onServer(Events.vehicle.set.rpm, (value: number) => {
    if (!alt.Player.local.vehicle) {
        return;
    }

    alt.Player.local.vehicle.rpm = value;
});
