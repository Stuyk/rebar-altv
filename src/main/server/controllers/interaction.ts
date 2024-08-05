import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import * as Utility from '@Shared/utility/index.js';
import { useBlipGlobal } from './blip.js';
import { useMarkerGlobal } from './markers.js';
import { useD2DTextLabel } from './d2dTextLabel.js';

export type InteractionCallback = (entity: alt.Player, colshape: alt.Colshape, uid: string) => void;

type InteractionInternal = {
    uid: string;
    handleEnter: (player: alt.Player) => void;
    handleLeave: (player: alt.Player) => void;
    handleInteract: (player: alt.Player) => void;
    type: 'vehicle' | 'player' | 'any';
};

const SessionKey = 'colshape:uid';
const interactions: Array<InteractionInternal> = [];

function getIndex(colshape: alt.Colshape): number {
    if (!colshape.valid) {
        return -1;
    }

    const uid = colshape.getMeta(SessionKey);
    if (!uid) {
        return -1;
    }

    return interactions.findIndex((x) => x.uid === uid);
}

function isValid(entity: alt.Entity, interaction: InteractionInternal) {
    if (!(entity instanceof alt.Player)) {
        return false;
    }

    let valid = false;

    if (interaction.type === 'player' && !entity.vehicle) {
        valid = true;
    }

    if (interaction.type === 'vehicle' && entity.vehicle && entity.vehicle.driver === entity) {
        valid = true;
    }

    if (interaction.type === 'any') {
        valid = true;
    }

    return valid;
}

function onEnter(colshape: alt.Colshape, entity: alt.Entity) {
    const index = getIndex(colshape);
    if (index <= -1) {
        return;
    }

    const interaction = interactions[index];
    if (!isValid(entity, interaction)) {
        return;
    }

    interaction.handleEnter(entity as alt.Player);
}

function onLeave(colshape: alt.Colshape, entity: alt.Entity) {
    const index = getIndex(colshape);
    if (index <= -1) {
        if (entity instanceof alt.Player) entity.emit(Events.controllers.interaction.clear);
        return;
    }

    const interaction = interactions[index];
    if (!isValid(entity, interaction)) {
        if (entity instanceof alt.Player) entity.emit(Events.controllers.interaction.clear);
        return;
    }

    interaction.handleLeave(entity as alt.Player);
}

function onInteract(player: alt.Player, uid: string) {
    const index = interactions.findIndex((x) => x.uid === uid);
    if (index <= -1) {
        return;
    }

    interactions[index].handleInteract(player);
}

export function useInteraction(colshape: alt.Colshape, type: 'vehicle' | 'player' | 'any', uid: string = undefined) {
    if (!uid) {
        uid = Utility.uid.generate();
    }

    const callbacks: InteractionCallback[] = [];
    const onEnterCallbacks: InteractionCallback[] = [];
    const onLeaveCallbacks: InteractionCallback[] = [];
    const shape = colshape;
    shape.playersOnly = false;
    shape.setMeta(SessionKey, uid);

    let msgEnter = undefined;
    let msgLeave = undefined;

    let blip: ReturnType<typeof useBlipGlobal>;
    let marker: ReturnType<typeof useMarkerGlobal>;
    let label: ReturnType<typeof useD2DTextLabel>;

    function handleEnter(player: alt.Player) {
        player.emit(Events.controllers.interaction.set, uid, msgEnter, colshape.pos);

        for (let cb of onEnterCallbacks) {
            cb(player, colshape, uid);
        }
    }

    function handleLeave(player: alt.Player) {
        player.emit(Events.controllers.interaction.set, uid, msgLeave, colshape.pos);

        for (let cb of onLeaveCallbacks) {
            cb(player, colshape, uid);
        }
    }

    function handleInteract(player: alt.Player) {
        if (!colshape.isEntityIn(player)) {
            return;
        }

        for (let cb of callbacks) {
            cb(player, colshape, uid);
        }
    }

    /**
     * Called when a player presses 'E' in the interaction point
     *
     * @param {InteractionCallback} callback
     */
    function on(callback: InteractionCallback) {
        callbacks.push(callback);
    }

    /**
     * Called when the player enters the interaction point
     *
     * @param {InteractionCallback} callback
     */
    function onEnter(callback: InteractionCallback) {
        onEnterCallbacks.push(callback);
    }

    /**
     * Called when the player leaves the interaction point
     *
     * @param {InteractionCallback} callback
     */
    function onLeave(callback: InteractionCallback) {
        onLeaveCallbacks.push(callback);
    }

    /**
     * Destroy the interaction point, and any attached label, blip, or marker
     *
     */
    function destroy() {
        const index = getIndex(shape);
        if (index >= 0) {
            interactions.splice(index, 1);
        }

        try {
            shape.destroy();
        } catch (err) {}

        if (label) {
            label.destroy();
        }

        if (blip) {
            blip.destroy();
        }

        if (marker) {
            marker.destroy();
        }
    }

    /**
     * Add an on enter / leave message, that is passed to client-side.
     *
     * Message does not show automatically.
     *
     *
     * @param {('enter' | 'leave')} type
     * @param {string} msg
     * @return
     */
    function setMessage(type: 'enter' | 'leave', msg: string) {
        if (type === 'enter') {
            msgEnter = msg;
            return;
        }

        msgLeave = msg;
    }

    interactions.push({ handleEnter, handleLeave, handleInteract, uid, type });

    return {
        addBlip: (...args: Parameters<typeof useBlipGlobal>) => {
            if (blip) {
                blip.destroy();
            }

            blip = useBlipGlobal(...args);
            return blip;
        },
        addMarker: (...args: Parameters<typeof useMarkerGlobal>) => {
            if (marker) {
                marker.destroy();
            }

            marker = useMarkerGlobal(...args);
            return marker;
        },
        addTextLabel: (...args: Parameters<typeof useD2DTextLabel>) => {
            if (label) {
                label.destroy();
            }

            label = useD2DTextLabel(...args);
            return label;
        },
        getPos() {
            return colshape.pos;
        },
        getBlip() {
            return blip;
        },
        getMarker() {
            return marker;
        },
        getTextLabel() {
            return label;
        },
        on,
        onEnter,
        onLeave,
        destroy,
        setMessage,
        type,
        uid,
    };
}

alt.on('entityEnterColshape', onEnter);
alt.on('entityLeaveColshape', onLeave);
alt.onClient(Events.controllers.interaction.trigger, onInteract);
