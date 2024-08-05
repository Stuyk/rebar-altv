import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { Events } from '@Shared/events/index.js';
import {iObject} from '@Shared/types/index.js';

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

    let newObject = new alt.Object(objectData.model, objectData.pos, objectData.rot ?? alt.Vector3.zero, 255);
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

    async function updateModel(model: number) {
        objectData.model = model;
        const newObjectInstance = new alt.Object(
            objectData.model,
            objectData.pos,
            objectData.rot ?? alt.Vector3.zero,
            255,
        );
        newObjectInstance.dimension = objectData.dimension ?? 0;
        newObjectInstance.setStreamSyncedMeta('data', objectData.data);

        await alt.Utils.wait(1000);

        try {
            newObject.destroy();
        } catch (err) {}

        newObject = newObjectInstance;
    }

    function updatePosition(pos: alt.Vector3) {
        newObject.pos = pos;
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
        updateModel,
        updatePosition,
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

    if (!objectData.dimension) {
        objectData.dimension = 0;
    }

    if (!objectData.rot) {
        objectData.rot = alt.Vector3.zero;
    }

    function destroy() {
        player.emit(Events.controllers.object.destroy, objectData.uid);
    }

    function update(newObjectData: Partial<iObject>) {
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
