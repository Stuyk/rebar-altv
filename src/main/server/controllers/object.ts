import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { TextLabel } from '@Shared/types/textLabel.js';
import { Events } from '@Shared/events/index.js';
import { iObject } from '@Shared/types/object.js';

/**
 * Create an object globally
 *
 * @export
 * @param {iObject} objectData
 * @return
 */
export function useObjectGlobal(objectData: iObject) {
    if (!objectData.uid) {
        objectData.uid = Utility.uid.generate();
    }

    const newObject = new alt.Object(objectData.model, objectData.pos, objectData.rot ?? alt.Vector3.zero, 255);
    newObject.dimension = objectData.dimension ?? 0;
    newObject.setStreamSyncedMeta('data', objectData.data);

    function destroy() {
        try {
            newObject.destroy();
        } catch (err) {}
    }

    function update(newObjectData: Partial<iObject>) {
        for (let key of Object.keys(newObjectData)) {
            objectData[key] = newObjectData[key];
            if (!newObject[key]) {
                continue;
            }

            newObject[key] = newObjectData[key];
        }
    }

    return {
        destroy,
        getData() {
            return objectData;
        },
        getObject() {
            return newObject;
        },
        update,
    };
}

export type GlobalObject = ReturnType<typeof useObjectGlobal>;

/**
 * Create an object for a single player to see
 *
 * @export
 * @param {alt.Player} player
 * @param {iObject} objectData
 * @return
 */
export function useObjectLocal(player: alt.Player, objectData: iObject) {
    if (!objectData.uid) {
        objectData.uid = Utility.uid.generate();
    }

    function destroy() {
        player.emit(Events.controllers.textlabel.destroy, objectData.uid);
    }

    function update(newObjectData: Partial<TextLabel>) {
        objectData = Object.assign(objectData, newObjectData);

        for (let key of Object.keys(newObjectData)) {
            objectData[key] = newObjectData[key];
        }

        player.emit(Events.controllers.object.create, objectData);
    }

    player.emit(Events.controllers.object.create, objectData);

    return {
        destroy,
        getData() {
            return objectData;
        },
        update,
    };
}

export type LocalObject = ReturnType<typeof useObjectLocal>;
