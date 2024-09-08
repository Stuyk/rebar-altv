import * as alt from 'alt-client';
import * as native from 'natives';

import { Door, DoorState } from '@Shared/types/index.js';
import { drawText3D } from '@Client/screen/textlabel.js';

let doors: Array<Door & { entity: alt.Object }> = [];
let interval: number;

function draw() {
    if (doors.length <= 0) return;

    for (const door of doors) {
        if (alt.debug) {
            const dist = alt.Player.local.pos.distanceTo(door.pos);
            if (dist > 5) continue;
            drawText3D(`UID: ${door.uid} - State: ${door.state}`, door.pos, 0.5, new alt.RGBA(255, 255, 255, 255));
        }

        native.setStateOfClosestDoorOfType(
            door.model,
            door.pos.x,
            door.pos.y,
            door.pos.z,
            door.state === DoorState.LOCKED,
            0,
            false,
        );
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isDoor(entity)) return;

    if (!interval) {
        interval = alt.setInterval(draw, 0);
    }

    const data = getData(entity);
    if (!data) return;

    const index = doors.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        doors[index] = { ...data, entity };
    } else {
        doors.push({ ...data, entity });
    }
}

function onStreamExit(entity: alt.Object) {
    if (!isDoor(entity)) return;

    const data = getData(entity);
    if (!data) return;

    for (let i = doors.length - 1; i >= 0; i--) {
        if (doors[i].uid !== data.uid) continue;
        doors.splice(i, 1);
    }

    if (doors.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isDoor(entity)) return;

    const data = getData(entity);
    if (!data) return;

    const index = doors.findIndex((x) => x.uid === data.uid);
    if (index <= -1) return;

    doors[index] = { ...data, entity };
}

function getData(object: alt.Object): Door {
    return object.getStreamSyncedMeta('door') as Door;
}

function isDoor(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === 'door';
}

alt.log(`Virtual Entities - Loaded Doors Handler`);
alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
