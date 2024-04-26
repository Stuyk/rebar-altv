import * as alt from 'alt-server';
import * as Utility from '../../shared/utility/index.js';
import { Blip } from '../../shared/types/blip.js';
import { Events } from '../../shared/events/index.js';

export function useBlipGlobal(blipData: Blip) {
    if (!blipData.uid) {
        blipData.uid = Utility.uid.generate();
    }

    if (!blipData.dimension) {
        blipData.dimension = 0;
    }

    let blip: alt.PointBlip;

    function create() {
        blip = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z, true);

        if (typeof blipData.scale !== 'undefined') {
            blip.scale = blipData.scale;
        }

        if (typeof blipData.category !== 'undefined') {
            blip.category = blipData.category;
        }

        blip.sprite = blipData.sprite;
        blip.color = blipData.color;
        blip.shortRange = blipData.shortRange;
        blip.name = blipData.text;
        blip.dimension = blipData.dimension ?? 0;
    }

    function destroy() {
        if (!blip) {
            return;
        }

        try {
            blip.destroy();
        } catch (err) {}
    }

    function update(newBlip: Partial<Blip>) {
        blipData = Object.assign(blipData, newBlip);
        try {
            blip.destroy();
        } catch (err) {}

        create();
    }

    create();

    return {
        destroy,
        getEntity() {
            return blip;
        },
        getBlip() {
            return blipData;
        },
        update,
    };
}

export type GlobalBlip = ReturnType<typeof useBlipGlobal>;

export function useBlipLocal(player: alt.Player, blipData: Blip) {
    if (!blipData.uid) {
        blipData.uid = Utility.uid.generate();
    }

    if (!blipData.dimension) {
        blipData.dimension = player.dimension;
    }

    function destroy() {
        player.emit(Events.controllers.blip.destroy, blipData.uid);
    }

    function update(newMarker: Partial<Blip>) {
        blipData = Object.assign(blipData, newMarker);
        player.emit(Events.controllers.blip.create, blipData);
    }

    player.emit(Events.controllers.blip.create, blipData);

    return {
        destroy,
        getBlip() {
            return blipData;
        },
        update,
    };
}

export type LocalBlip = ReturnType<typeof useBlipLocal>;
