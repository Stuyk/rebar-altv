import * as alt from 'alt-server';
import * as Utility from '../../shared/utility/index.js';
import { TextLabel } from '../../shared/types/textLabel.js';
import { Events } from '../../shared/events/index.js';
import { Object } from '../../shared/types/object.js';
import { Vector3 } from 'alt-shared';

export function useObjectGlobal(objectData: Object) {
    if (!objectData.uid) {
        objectData.uid = Utility.uid.generate();
    }

    const newObject = new alt.Object(objectData.model, objectData.pos, objectData.rot ?? alt.Vector3.zero, 255);
    newObject.setStreamSyncedMeta('data', objectData.data);

    function destroy() {
        try {
            newObject.destroy();
        } catch (err) {}
    }

    function update(newObjectData: Partial<Object>) {
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

export function useObjectLocal(player: alt.Player, objectData: Object) {
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

const object = useObjectGlobal({ model: alt.hash('prop_barrel_pile_02'), pos: Vector3.zero });

object.update({ pos: new alt.Vector3(0, 0, 0) });
