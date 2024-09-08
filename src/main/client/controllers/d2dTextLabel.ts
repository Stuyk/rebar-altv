import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { D2DTextLabel } from '../../shared/types/d2dTextLabel.js';

const labels: (D2DTextLabel & { label: alt.TextLabel })[] = [];

function handleCreate(data: D2DTextLabel) {
    const idx = labels.findIndex((x) => x.uid == data.uid);
    if (idx <= -1) {
        const label = new alt.TextLabel(
            data.text,
            data.font,
            data.fontSize,
            data.fontScale,
            data.pos,
            data.rot,
            data.fontColor,
            data.fontOutline,
            data.fontOutlineColor,
            true,
            20,
        );
        label.faceCamera = true;
        labels.push({ ...data, label });
    } else {
        labels[idx] = Object.assign(labels[idx], data);
        labels[idx].label.text = data.text;
        labels[idx].label.pos = new alt.Vector3(data.pos);
    }
}

function handleDestroy(uid: string) {
    for (let i = labels.length - 1; i >= 0; i--) {
        if (labels[i].uid != uid) {
            continue;
        }

        labels[i].label.destroy();
        labels.splice(i, 1);
    }
}

alt.onServer(Events.controllers.dxgilabel.create, handleCreate);
alt.onServer(Events.controllers.dxgilabel.destroy, handleDestroy);
