import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { Marker } from '@Shared/types/marker.js';
import { Events } from '@Shared/events/index.js';

const GroupType = 'marker';
const MAX_MARKERS = 10;

const markerGroup = new alt.VirtualEntityGroup(MAX_MARKERS);

/**
 * Create a marker globally
 *
 * @export
 * @param {Marker} marker
 * @return
 */
export function useMarkerGlobal(marker: Marker, maxDistance: number = 50) {
    if (maxDistance > 50) {
        maxDistance = 50;
    }

    if (!marker.uid) {
        marker.uid = Utility.uid.generate();
    }

    if (!marker.dimension) {
        marker.dimension = 0;
    }

    let entity = new alt.VirtualEntity(markerGroup, new alt.Vector3(marker.pos), maxDistance, {
        type: GroupType,
        marker,
    });

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}
    }

    function update(newMarker: Partial<Marker>) {
        marker = Object.assign(marker, newMarker);
        try {
            entity.destroy();
        } catch (err) {}

        entity = new alt.VirtualEntity(markerGroup, new alt.Vector3(marker.pos), maxDistance, {
            type: GroupType,
            marker,
        });
    }

    return {
        destroy,
        getEntity() {
            return entity;
        },
        getMarker() {
            return marker;
        },
        update,
    };
}

export type GlobalMarker = ReturnType<typeof useMarkerGlobal>;

/**
 * Create a marker locally
 *
 * @export
 * @param {alt.Player} player
 * @param {Marker} marker
 * @return
 */
export function useMarkerLocal(player: alt.Player, marker: Marker) {
    if (!marker.uid) {
        marker.uid = Utility.uid.generate();
    }

    if (!marker.dimension) {
        marker.dimension = player.dimension;
    }

    function destroy() {
        player.emit(Events.controllers.marker.destroy, marker.uid);
    }

    function update(newMarker: Partial<Marker>) {
        marker = Object.assign(marker, newMarker);
        player.emit(Events.controllers.marker.create, marker);
    }

    player.emit(Events.controllers.marker.create, marker);

    return {
        destroy,
        getMarker() {
            return marker;
        },
        update,
    };
}

export type LocalMarker = ReturnType<typeof useMarkerLocal>;
