import { Marker } from '../../shared/types/marker.js';
import * as alt from 'alt-client';
import * as ScreenMarker from '../screen/marker.js';

let interval: number;
let markers: (Marker & { entity: alt.Entity })[] = [];

function draw() {
    for (let marker of markers) {
        if (!marker.scale) {
            marker.scale = new alt.Vector3(1, 1, 1);
        }

        ScreenMarker.draw(marker.type, marker.entity.pos, marker.scale, marker.color, false, false, false);
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isMarker(entity)) {
        return;
    }

    if (!interval) {
        interval = alt.setInterval(draw, 0);
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = markers.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        markers[index] = { ...data, entity };
    } else {
        markers.push({ ...data, entity });
    }
}

function onStreamExit(entity: alt.Object) {
    if (!isMarker(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    for (let i = markers.length - 1; i >= 0; i--) {
        if (markers[i].uid !== data.uid) {
            continue;
        }

        markers.splice(i, 1);
    }

    if (markers.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isMarker(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = markers.findIndex((x) => x.uid === data.uid);
    if (index <= -1) {
        return;
    }

    markers[index] = { ...data, entity };
}

function getData(object: alt.Object): Marker {
    return object.getStreamSyncedMeta('marker') as Marker;
}

function isMarker(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === 'marker';
}

alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
