import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';

alt.onServer(Events.vehicle.set.rpm, (value: number) => {
    if (!alt.Player.local.vehicle) {
        return;
    }

    alt.Player.local.vehicle.rpm = value;
});
