import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import {WeaponPickup} from '@Shared/types/index.js';
import {WeaponPickups} from '@Shared/data/pickups.js';

type PlayerCallback = (player: alt.Player, pickup: WeaponPickup, destroy: Function) => void;
type InternalPickup = { colshape: alt.Colshape; entity: alt.Object; invoke: (player: alt.Player) => void };

const sessionKey = 'pickup-info';
const bindings: { [key: string]: InternalPickup } = {};

export function usePickupGlobal(pickup: WeaponPickup) {
    if (!pickup.uid) {
        pickup.uid = Utility.uid.generate();
    }

    if (!pickup.dimension) {
        pickup.dimension = 0;
    }

    const callbacks: PlayerCallback[] = [];
    const colshape = new alt.ColshapeSphere(pickup.pos.x, pickup.pos.y, pickup.pos.z, 3);
    const objectData = WeaponPickups.find((x) => x.name === pickup.pickup);

    const entity = new alt.Object(alt.hash(objectData.model), pickup.pos, alt.Vector3.zero, 255, 0, 15, 25);
    entity.frozen = true;
    entity.collision = false;

    colshape.playersOnly = true;
    colshape.setMeta(sessionKey, pickup.uid);
    entity.setMeta(sessionKey, pickup.uid);

    bindings[pickup.uid] = {
        entity,
        colshape,
        invoke,
    };

    function on(cb: PlayerCallback) {
        callbacks.push(cb);
    }

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}

        try {
            colshape.destroy();
        } catch (err) {}

        delete bindings[pickup.uid];
    }

    function invoke(player: alt.Player) {
        for (let cb of callbacks) {
            cb(player, pickup, destroy);
        }
    }

    return {
        destroy,
        getEntity() {
            return entity;
        },
        getPickup() {
            return pickup;
        },
        invoke,
        on,
    };
}

function onEnter(colshape: alt.Colshape, entity: alt.Entity) {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!colshape.hasMeta(sessionKey)) {
        return;
    }

    const pickup = bindings[<string>colshape.getMeta(sessionKey)] as InternalPickup;
    if (!pickup.invoke) {
        return;
    }

    pickup.invoke(entity);
}

alt.on('entityEnterColshape', onEnter);
