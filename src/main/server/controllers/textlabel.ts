import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import {TextLabel} from '@Shared/types/index.js';
import * as Utility from '@Shared/utility/index.js';

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
export function useTextLabelGlobal(label: TextLabel, maxDistance: number = 20) {
    if (maxDistance > 20) {
        maxDistance = 20;
    }

    if (!label.uid) {
        label.uid = Utility.uid.generate();
    }

    let entity = new alt.VirtualEntity(labelGroup, new alt.Vector3(label.pos), maxDistance, {
        type: GroupType,
        textlabel: label,
    });

    entity.dimension = label.dimension ? label.dimension : 0;

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}
    }

    function update(newTextLabel: Partial<TextLabel>) {
        label = Object.assign(label, newTextLabel);
        try {
            entity.destroy();
        } catch (err) {}

        entity = new alt.VirtualEntity(labelGroup, new alt.Vector3(label.pos), maxDistance, {
            type: GroupType,
            textlabel: label,
        });

        if (newTextLabel.dimension !== entity.dimension) {
          entity.dimension = newTextLabel.dimension ? newTextLabel.dimension : 0;
        }
    }

    return {
        destroy,
        getEntity() {
            return entity;
        },
        getLabel() {
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
        getLabel() {
            return label;
        },
        update,
    };
}

export type LocalTextLabel = ReturnType<typeof useTextLabelLocal>;
