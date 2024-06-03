import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { TextLabel } from '@Shared/types/textLabel.js';
import { Events } from '@Shared/events/index.js';

const GroupType = 'textlabel';
const MAX_LABELS = 10;

const labelGroup = new alt.VirtualEntityGroup(MAX_LABELS);

/**
 * Create a global text label seen by all players
 *
 * @export
 * @param {TextLabel} label
 * @return
 */
export function useTextLabelGlobal(label: TextLabel, maxDistance: number = 50) {
    if (maxDistance > 50) {
        maxDistance = 50;
    }

    if (!label.uid) {
        label.uid = Utility.uid.generate();
    }

    let entity = new alt.VirtualEntity(labelGroup, new alt.Vector3(label.pos), MAX_STREAM_DISTANCE, {
        type: GroupType,
        textlabel: label,
    });

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}
    }

    function update(newMarker: Partial<TextLabel>) {
        label = Object.assign(label, newMarker);
        try {
            entity.destroy();
        } catch (err) {}

        entity = new alt.VirtualEntity(labelGroup, new alt.Vector3(label.pos), MAX_STREAM_DISTANCE, {
            type: GroupType,
            textlabel: label,
        });
    }

    return {
        destroy,
        getEntity() {
            return entity;
        },
        getMarker() {
            return label;
        },
        update,
    };
}

export type GlobalTextLabel = ReturnType<typeof useTextLabelGlobal>;

/**
 * Create a local text label for a given player
 *
 * @export
 * @param {alt.Player} player
 * @param {TextLabel} label
 * @return
 */
export function useTextLabelLocal(player: alt.Player, label: TextLabel) {
    if (!label.uid) {
        label.uid = Utility.uid.generate();
    }

    function destroy() {
        player.emit(Events.controllers.textlabel.destroy, label.uid);
    }

    function update(newMarker: Partial<TextLabel>) {
        label = Object.assign(label, newMarker);
        player.emit(Events.controllers.textlabel.create, label);
    }

    player.emit(Events.controllers.textlabel.create, label);

    return {
        destroy,
        getMarker() {
            return label;
        },
        update,
    };
}

export type LocalTextLabel = ReturnType<typeof useTextLabelLocal>;
