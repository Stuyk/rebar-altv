import * as alt from 'alt-client';
import { D2DTextLabel } from '../../shared/types/d2dTextLabel.js';

try {
    alt.Font.register('@rmlui/fonts/inter-bold.ttf');
    alt.Font.register('@rmlui/fonts/inter-black.ttf');
    alt.Font.register('@rmlui/fonts/inter-regular.ttf');
} catch (err) {
    console.log(err);
}

const GroupType = 'd2dlabel';

let labels: (D2DTextLabel & { entity: alt.Entity; label: alt.TextLabel })[] = [];

function onStreamEnter(entity: alt.Object) {
    if (!isVirtualEntity(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = labels.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        if (labels[index].label) {
            labels[index].label.text = data.text;
            labels[index].label.pos = new alt.Vector3(data.pos);
        }

        labels[index] = Object.assign(labels[index], data);
    } else {
        const newLabel = new alt.TextLabel(
            data.text,
            data.font,
            data.fontSize,
            data.fontScale,
            data.pos,
            alt.Vector3.zero,
            data.fontColor,
            data.fontOutline,
            data.fontOutlineColor,
            true,
            20,
        );

        newLabel.faceCamera = true;

        labels.push({
            ...data,
            entity,
            label: newLabel,
        });
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

        labels[i].label.destroy();
        labels.splice(i, 1);
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

    if (labels[index].label) {
        labels[index].label.text = data.text;
        labels[index].label.pos = new alt.Vector3(data.pos);
    }

    labels[index] = Object.assign(labels[index], data);
}

function getData(object: alt.Object) {
    return object.getStreamSyncedMeta(GroupType) as D2DTextLabel;
}

function isVirtualEntity(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === GroupType;
}

alt.log(`Virtual Entities - Loaded D2D Text Label Handler`);
alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
