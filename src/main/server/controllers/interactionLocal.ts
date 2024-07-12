import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';

type ColshapeTypes = {
    Circle: ConstructorParameters<typeof alt.ColshapeCircle>;
    Cuboid: ConstructorParameters<typeof alt.ColshapeCuboid>;
    Cylinder: ConstructorParameters<typeof alt.ColshapeCylinder>;
    Polygon: ConstructorParameters<typeof alt.ColshapePolygon>;
    Rectangle: ConstructorParameters<typeof alt.ColshapeRectangle>;
    Sphere: ConstructorParameters<typeof alt.ColshapeSphere>;
};

type Callback = (player: alt.Player, destroy: Function) => void;
type Invoke = (player: alt.Player) => void;

const invokers: {
    [id: string]: { uid: string; invokeEnter: Invoke; invokeLeave: Invoke; invoke: Invoke; destroy: Function }[];
} = {};

function removeByUid(id: number, uid: string) {
    if (!invokers[id]) {
        return;
    }

    for (let i = invokers[id].length - 1; i >= 0; i--) {
        if (invokers[id][i].uid !== uid) {
            continue;
        }

        invokers[id].splice(i, 1);
        break;
    }
}

function removeAll(id: number) {
    if (!invokers[id]) {
        return;
    }

    for (let invoker of invokers[id]) {
        invoker.destroy();
    }

    delete invokers[id];
}

function getInvoker(player: alt.Player, uid: string) {
    if (!player || !player.valid) {
        return undefined;
    }

    if (!invokers[player.id]) {
        return undefined;
    }

    return invokers[player.id].find((x) => x.uid === uid);
}

/**
 * Called when a player enters the interaction
 *
 * @param {alt.Player} player
 * @param {string} uid
 * @return
 */
function onClientEnter(player: alt.Player, uid: string) {
    const invoker = getInvoker(player, uid);
    if (!invoker) {
        return;
    }

    invoker.invokeEnter(player);
}

/**
 * Called when a player leaves the interaction
 *
 * @param {alt.Player} player
 * @param {string} uid
 * @return
 */
function onClientLeave(player: alt.Player, uid: string) {
    const invoker = getInvoker(player, uid);
    if (!invoker) {
        return;
    }

    invoker.invokeLeave(player);
}

/**
 * Called when a player presses 'E'
 *
 * @param {alt.Player} player
 * @param {string} uid
 * @return
 */
function onClient(player: alt.Player, uid: string) {
    const invoker = getInvoker(player, uid);
    if (!invoker) {
        return;
    }

    invoker.invoke(player);
}

export function useInteractionLocal<K extends keyof ColshapeTypes>(
    player: alt.Player,
    uid: string,
    type: K,
    args: ColshapeTypes[K],
) {
    const _type: keyof ColshapeTypes = type;
    const _args: ColshapeTypes[K] = args;
    const _uid = uid;
    const onEnterCallbacks: Callback[] = [];
    const onLeaveCallbacks: Callback[] = [];
    const onCallbacks: Callback[] = [];

    function getUid() {
        return _uid;
    }

    function destroy() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.controllers.interactionLocal.destroy, _uid);
        removeByUid(player.id, _uid);
    }

    function onEnter(cb: Callback) {
        onEnterCallbacks.push(cb);
    }

    function onLeave(cb: Callback) {
        onLeaveCallbacks.push(cb);
    }

    function on(cb: Callback) {
        onCallbacks.push(cb);
    }

    function invokeEnter(player: alt.Player) {
        for (let cb of onEnterCallbacks) {
            cb(player, destroy);
        }
    }

    function invokeLeave(player: alt.Player) {
        for (let cb of onLeaveCallbacks) {
            cb(player, destroy);
        }
    }

    function invoke(player: alt.Player) {
        for (let cb of onCallbacks) {
            cb(player, destroy);
        }
    }

    if (!invokers[player.id]) {
        invokers[player.id] = [];
    }

    invokers[player.id].push({ uid, invokeEnter, invokeLeave, invoke, destroy });
    player.emit(Events.controllers.interactionLocal.create, _uid, _type, _args);

    return {
        destroy,
        getUid,
        onEnter,
        onLeave,
        on,
    };
}

alt.on('playerDisconnect', (player: alt.Player) => removeAll(player.id));
alt.onClient(Events.controllers.interactionLocal.on, onClient);
alt.onClient(Events.controllers.interactionLocal.onEnter, onClientEnter);
alt.onClient(Events.controllers.interactionLocal.onLeave, onClientLeave);
