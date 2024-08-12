import * as alt from 'alt-client';
import {Marker} from '@Shared/types/index.js';
import * as ScreenMarker from '../screen/marker.js';

const GroupType = 'marker';

let markers: (Marker & { entity: alt.Entity })[] = [];

function draw() {
    for (let marker of markers) {
        if (!marker.scale) {
            marker.scale = new alt.Vector3(1, 1, 1);
        }
        ScreenMarker.draw(marker.type as number, marker.entity.pos, marker.scale, marker.color, marker.bobUpAndDown ?? false, marker.faceCamera ?? false, marker.rotate ?? false);
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isVirtualEntity(entity)) {
        return;
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
    if (!isVirtualEntity(entity)) {
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
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isVirtualEntity(entity)) {
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
    return object.getStreamSyncedMeta(GroupType) as Marker;
}

function isVirtualEntity(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === GroupType;
}

alt.log(`Virtual Entities - Loaded Marker Handler`);
alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
alt.everyTick(draw);
