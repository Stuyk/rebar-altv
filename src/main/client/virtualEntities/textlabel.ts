import * as alt from 'alt-client';
import { TextLabel } from '@Shared/types/textLabel.js';
import * as ScreenText from '../screen/textlabel.js';

const GroupType = 'textlabel';

let interval: number;
let markers: (TextLabel & { entity: alt.Entity })[] = [];

function draw() {
    for (let label of markers) {
        ScreenText.drawText3D(label.text, label.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isVirtualEntity(entity)) {
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

    if (markers.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
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

function getData(object: alt.Object) {
    return object.getStreamSyncedMeta(GroupType) as TextLabel;
}

function isVirtualEntity(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === GroupType;
}

alt.log(`Virtual Entities - Loaded Text Label Handler`);
alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
