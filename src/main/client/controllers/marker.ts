import * as alt from 'alt-client';
import * as ScreenMarker from '../screen/marker.js';
import { Events } from '@Shared/events/index.js';
import { Marker } from '@Shared/types/index.js';
import { distance2d } from '@Shared/utility/vector.js';

const MAX_DISTANCE = 50;
const markers: Marker[] = [];

function draw() {
    if (markers.length <= 0) {
        return;
    }

    for (let marker of markers) {
        const dist = distance2d(alt.Player.local.pos, marker.pos);
        if (dist > MAX_DISTANCE) {
            continue;
        }

        if (marker.dimension !== alt.Player.local.dimension) {
            continue;
        }

        ScreenMarker.draw(marker.type as number, marker.pos, marker.scale, marker.color, false, false, false);
    }
}

function handleCreate(marker: Marker) {
    const idx = markers.findIndex((x) => x.uid == marker.uid);
    if (idx <= -1) {
        markers.push(marker);
    } else {
        markers[idx] = marker;
    }
}

function handleDestroy(uid: string) {
    for (let i = markers.length - 1; i >= 0; i--) {
        if (markers[i].uid != uid) {
            continue;
        }

        markers.splice(i, 1);
    }
}

alt.log(`Controllers - Loaded Marker Handler`);
alt.onServer(Events.controllers.marker.create, handleCreate);
alt.onServer(Events.controllers.marker.destroy, handleDestroy);
alt.everyTick(draw);
