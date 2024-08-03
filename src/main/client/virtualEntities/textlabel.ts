import * as alt from 'alt-client';
import {TextLabel} from '@Shared/types/index.js';
import * as ScreenText from '../screen/textlabel.js';

const GroupType = 'textlabel';

let interval: number;
let labels: (TextLabel & { entity: alt.Entity })[] = [];

function draw() {
    for (let label of labels) {
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

    const index = labels.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        labels[index] = { ...data, entity };
    } else {
        labels.push({ ...data, entity });
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

    for (let i = labels.length - 1; i >= 0; i--) {
        if (labels[i].uid !== data.uid) {
            continue;
        }

        labels.splice(i, 1);
    }

    if (labels.length <= 0) {
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

    const index = labels.findIndex((x) => x.uid === data.uid);
    if (index <= -1) {
        return;
    }

    labels[index] = { ...data, entity };
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
