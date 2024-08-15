import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { Blip } from '@Shared/types/index.js';

const blips: { [key: string]: alt.PointBlip } = {};

async function handleCreate(blipData: Blip) {
    handleDestroy(blipData.uid);

    blips[blipData.uid] = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z);
    if (typeof blipData.scale !== 'undefined') {
        blips[blipData.uid].scale = blipData.scale;
    }

    if (typeof blipData.category !== 'undefined') {
        blips[blipData.uid].category = blipData.category;
    }

    if (typeof blipData.routeColor !== 'undefined') {
        blips[blipData.uid].route = true;
        blips[blipData.uid].routeColor = blipData.routeColor;
    }

    blips[blipData.uid].sprite = blipData.sprite as number;
    blips[blipData.uid].color = blipData.color as number;
    blips[blipData.uid].shortRange = blipData.shortRange;
    blips[blipData.uid].name = blipData.text;
    blips[blipData.uid].dimension = blipData.dimension ?? 0;
}

function handleDestroy(uid: string) {
    if (blips[uid]) {
        try {
            blips[uid].destroy();
        } catch (err) {}
    }

    delete blips[uid];
}

alt.log(`Controllers - Loaded Blip Handler`);
alt.onServer(Events.controllers.blip.create, handleCreate);
alt.onServer(Events.controllers.blip.destroy, handleDestroy);
