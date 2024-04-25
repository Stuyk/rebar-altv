import * as alt from 'alt-server';
import * as Utility from '../../shared/utility/index.js';
import { Marker, MarkerType } from '../../shared/types/marker.js';
import { Events } from '../../shared/events/index.js';

const MAX_STREAM_DISTANCE = 100;
const MAX_MARKERS = 10;

const markerGroup = new alt.VirtualEntityGroup(MAX_MARKERS);

/**
 * Create a marker globally
 *
 * @export
 * @param {Marker} marker
 * @return
 */
export function useMarkerGlobal(marker: Marker) {
    if (!marker.uid) {
        marker.uid = Utility.uid.generate();
    }

    let entity = new alt.VirtualEntity(markerGroup, new alt.Vector3(marker.pos), MAX_STREAM_DISTANCE, {
        type: 'marker',
        ...marker,
    });

    function destroy() {
        entity.destroy();
    }

    function update(newMarker: Partial<Marker>) {
        marker = Object.assign(marker, newMarker);
        try {
            entity.destroy();
        } catch (err) {}

        entity = new alt.VirtualEntity(markerGroup, new alt.Vector3(marker.pos), MAX_STREAM_DISTANCE, {
            type: 'marker',
            ...marker,
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
