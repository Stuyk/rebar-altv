import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import {BlipNames} from '@Shared/data/blipNames.js';
import { Events } from '@Shared/events/index.js';
import {Blip, BlipColor} from '@Shared/types/index.js';

let interval: number;

type AttachedBlips = Pick<
    ReturnType<typeof useBlipGlobal>,
    'updateAttachement' | 'destroy' | 'isAttached' | 'isValidAttachment' | 'getBlip'
>;

const attachedBlips: AttachedBlips[] = [];

function tick() {
    if (attachedBlips.length <= 0) {
        return;
    }

    for (let i = attachedBlips.length - 1; i >= 0; i--) {
        if (!attachedBlips[i].isValidAttachment()) {
            attachedBlips[i].destroy();
            attachedBlips.splice(i, 1);
            continue;
        }

        attachedBlips[i].updateAttachement();
    }
}

export function useBlipGlobal(blipData: Blip) {
    if (!blipData.uid) {
        blipData.uid = Utility.uid.generate();
    }

    if (!blipData.dimension) {
        blipData.dimension = 0;
    }

    if (typeof blipData.sprite === 'string') {
        blipData.sprite = BlipNames[blipData.sprite];
    }

    if (typeof blipData.color === 'string') {
        blipData.color = BlipColor[blipData.color];
    }

    if (typeof blipData.shortRange === 'undefined') {
        blipData.shortRange = true;
    }

    let blip: alt.PointBlip;
    let entity: alt.Entity;

    /**
     * Create the blip and the necessary data to show it
     *
     */
    function create() {
        blip = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z, true);

        if (typeof blipData.scale !== 'undefined') {
            blip.scale = blipData.scale;
        }

        if (typeof blipData.category !== 'undefined') {
            blip.category = blipData.category;
        }

        blip.sprite = blipData.sprite as number;
        blip.color = blipData.color as number;
        blip.shortRange = blipData.shortRange;
        blip.name = blipData.text;
        blip.dimension = blipData.dimension ?? 0;
    }

    /**
     * Pick an entity to attach the blip to, or update to a new entity
     *
     * @param {alt.Entity} targetEntity
     */
    function attach(targetEntity: alt.Entity) {
        entity = targetEntity;

        if (typeof interval === 'undefined') {
            interval = alt.setInterval(tick, 0);
        }

        const index = attachedBlips.findIndex((x) => x.getBlip().uid === blipData.uid);
        if (index >= 0) {
            return;
        }

        attachedBlips.push({ getBlip, isAttached, isValidAttachment, destroy, updateAttachement });
    }

    /**
     * Updates the blip to follow the provided entity
     *
     * @return
     */
    function updateAttachement() {
        if (!entity || !entity.valid) {
            return;
        }

        blip.pos = entity.pos;
    }

    /**
     * Destroy the blip, automatically detaches
     *
     * @return
     */
    function destroy() {
        if (!blip) {
            return;
        }

        try {
            blip.destroy();
        } catch (err) {}
    }

    /**
     * Update the blip with new dasta
     *
     * @param {Partial<Blip>} newBlip
     */
    function update(newBlip: Partial<Blip>) {
        blipData = Object.assign(blipData, newBlip);
        try {
            blip.destroy();
        } catch (err) {}

        create();
    }

    /**
     * Check if the entity is attached
     *
     * @return
     */
    function isAttached() {
        return typeof entity !== 'undefined';
    }

    /**
     * Check if the blip is valid, and the entity are valid
     *
     * @return
     */
    function isValidAttachment() {
        if (!blip || !blip.valid) {
            return false;
        }

        return entity && entity.valid;
    }

    /**
     * Return the data that was used to create this blip
     *
     * @return
     */
    function getBlip() {
        return blipData;
    }

    create();

    return {
        attach,
        destroy,
        getEntity() {
            return blip;
        },
        getBlip,
        isAttached,
        isValidAttachment,
        update,
        updateAttachement,
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

    if (typeof blipData.sprite === 'string') {
        blipData.sprite = BlipNames[blipData.sprite];
    }

    if (typeof blipData.color === 'string') {
        blipData.color = BlipColor[blipData.color];
    }

    if (typeof blipData.shortRange === 'undefined') {
        blipData.shortRange = true;
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
