import * as alt from 'alt-client';
import * as ScreenText from '../screen/textlabel.js';
import { Events } from '@Shared/events/index.js';
import {TextLabel} from '@Shared/types/index.js';
import { distance2d } from '@Shared/utility/vector.js';

const MAX_DISTANCE = 25;
const labels: TextLabel[] = [];

function draw() {
    if (labels.length <= 0) {
        return;
    }

    for (let label of labels) {
        const dist = distance2d(alt.Player.local.pos, label.pos);
        if (dist > MAX_DISTANCE) {
            continue;
        }

        if (label.dimension !== alt.Player.local.dimension) {
            continue;
        }

        // Note: You use can use ~r~ and various other tags to change text colors
        // Leave the RGBA alone and use the built-in color providers provided in the natives
        ScreenText.drawText3D(label.text, label.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

function handleCreate(label: TextLabel) {
    const idx = labels.findIndex((x) => x.uid == label.uid);
    if (idx <= -1) {
        labels.push(label);
    } else {
        labels[idx] = label;
    }
}

function handleDestroy(uid: string) {
    for (let i = labels.length - 1; i >= 0; i--) {
        if (labels[i].uid != uid) {
            continue;
        }

        labels.splice(i, 1);
    }
}

alt.onServer(Events.controllers.textlabel.create, handleCreate);
alt.onServer(Events.controllers.textlabel.destroy, handleDestroy);
alt.everyTick(draw);
