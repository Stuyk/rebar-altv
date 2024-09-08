import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { Events } from '@Shared/events/index.js';
import { D2DTextLabel } from '../../shared/types/d2dTextLabel.js';

const GroupType = 'd2dlabel';
const MAX_LABELS = 10;

const labelGroup = new alt.VirtualEntityGroup(MAX_LABELS);

/**
 * Create a global dxgi text label seen by all players
 *
 * @export
 * @param {D2DTextLabel} label
 * @return
 */
export function useD2DTextLabel(label: D2DTextLabel, maxDistance: number = 20) {
    if (maxDistance > 20) {
        maxDistance = 20;
    }

    if (!label.uid) {
        label.uid = Utility.uid.generate();
    }

    if (!label.font) {
        label.font = 'Inter';
    }

    if (!label.fontScale) {
        label.fontScale = 0.25;
    }

    if (!label.fontSize) {
        label.fontSize = 128;
    }

    if (!label.fontOutlineColor) {
        label.fontOutlineColor = new alt.RGBA(0, 0, 0, 255);
    }

    if (!label.fontColor) {
        label.fontColor = new alt.RGBA(255, 255, 255, 255);
    }

    if (typeof label.fontOutline === 'undefined') {
        label.fontOutline = 12;
    }

    if (!label.rot) {
        label.rot = alt.Vector3.zero;
    }

    let entity = new alt.VirtualEntity(labelGroup, new alt.Vector3(label.pos), maxDistance, {
        type: GroupType,
        [GroupType]: label,
    });

    entity.dimension = label.dimension ? label.dimension : 0;

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}
    }

    function update(newLabel: Partial<D2DTextLabel>) {
        label = Object.assign(label, newLabel);
        entity.setStreamSyncedMeta(GroupType, label);
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

export type GlobalD2DTextLabel = ReturnType<typeof useD2DTextLabel>;

/**
 * Create a local text label for a given player
 *
 * @export
 * @param {alt.Player} player
 * @param {D2DTextLabel} label
 * @return
 */
export function useD2DTextLabelLocal(player: alt.Player, label: D2DTextLabel) {
    if (!label.uid) {
        label.uid = Utility.uid.generate();
    }

    if (!label.font) {
        label.font = 'Inter';
    }

    if (!label.fontScale) {
        label.fontScale = 0.25;
    }

    if (!label.fontSize) {
        label.fontSize = 128;
    }

    if (!label.fontOutlineColor) {
        label.fontOutlineColor = new alt.RGBA(0, 0, 0, 255);
    }

    if (!label.fontColor) {
        label.fontColor = new alt.RGBA(255, 255, 255, 255);
    }

    if (typeof label.fontOutline === 'undefined') {
        label.fontOutline = 12;
    }

    if (!label.rot) {
        label.rot = alt.Vector3.zero;
    }

    if (!label.dimension) {
        label.dimension = 0;
    }

    function destroy() {
        player.emit(Events.controllers.dxgilabel.destroy, label.uid);
    }

    function update(newMarker: Partial<D2DTextLabel>) {
        label = Object.assign(label, newMarker);
        player.emit(Events.controllers.dxgilabel.create, label);
    }

    player.emit(Events.controllers.dxgilabel.create, label);

    return {
        destroy,
        getLabel() {
            return label;
        },
        update,
    };
}

export type LocalD2DTextLabel = ReturnType<typeof useD2DTextLabelLocal>;
