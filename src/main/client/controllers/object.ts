import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import {iObject} from '@Shared/types/index.js';
import { distance2d } from '@Shared/utility/vector.js';

const MAX_DISTANCE = 50;
const objects: iObject[] = [];
const objectsDrawn: { [key: string]: alt.LocalObject } = {};

function draw() {
    for (let object of objects) {
        const dist = distance2d(alt.Player.local.pos, object.pos);

        if (dist > MAX_DISTANCE || object.dimension != alt.Player.local.dimension) {
            if (!objectsDrawn[object.uid]) {
                continue;
            }

            try {
                objectsDrawn[object.uid].destroy();
            } catch (err) {}

            delete objectsDrawn[object.uid];
            continue;
        }

        if (objectsDrawn[object.uid]) {
            continue;
        }

        objectsDrawn[object.uid] = new alt.LocalObject(
            object.model,
            new alt.Vector3(object.pos),
            new alt.Vector3(object.rot),
            true,
            false,
            false,
            50,
        );

        objectsDrawn[object.uid].frozen = true;
    }
}

async function handleCreate(object: iObject) {
    try {
        await alt.Utils.requestModel(object.model);
    } catch (err) {
        alt.logWarning(`${object.model} is not a valid model hash`);
        return;
    }

    const idx = objects.findIndex((x) => x.uid == object.uid);
    if (idx <= -1) {
        objects.push(object);
    } else {
        objects[idx] = object;
    }

    if (objectsDrawn[object.uid]) {
        try {
            objectsDrawn[object.uid].destroy();
        } catch (err) {}

        delete objectsDrawn[object.uid];
    }
}

function handleDestroy(uid: string) {
    for (let i = objects.length - 1; i >= 0; i--) {
        if (objects[i].uid == uid) {
            objects.splice(i, 1);
        }
    }

    if (objectsDrawn[uid]) {
        try {
            objectsDrawn[uid].destroy();
        } catch (err) {}

        delete objectsDrawn[uid];
    }
}

alt.log(`Controllers - Loaded Object Handler`);
alt.onServer(Events.controllers.object.create, handleCreate);
alt.onServer(Events.controllers.object.destroy, handleDestroy);
alt.everyTick(draw);
