import * as alt from 'alt-client';
import * as native from 'natives';
import {Spinner} from '@Shared/types/index.js';
import { Events } from '@Shared/events/index.js';

let timeout: number;

/**
 * Used to clear the last set spinner.
 *
 */
export function destroy() {
    if (timeout) {
        alt.clearTimeout(timeout);
        timeout = null;
    }

    native.busyspinnerOff();
}

export function create(data: Spinner) {
    destroy();

    if (!data.type) {
        data.type = 0;
    }

    native.beginTextCommandBusyspinnerOn('STRING');
    native.addTextComponentSubstringPlayerName(data.text);
    native.endTextCommandBusyspinnerOn(data.type);

    if (data.duration <= 0) {
        data.duration = 5000;
    }

    timeout = alt.setTimeout(destroy, data.duration);
}

alt.onServer(Events.player.notify.spinner.create, create);
alt.onServer(Events.player.notify.spinner.destroy, destroy);
