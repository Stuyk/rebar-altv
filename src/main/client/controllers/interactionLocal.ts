import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';
import { useMessenger } from '../system/messenger.js';

type ColshapeTypes = {
    Circle: ConstructorParameters<typeof alt.ColshapeCircle>;
    Cuboid: ConstructorParameters<typeof alt.ColshapeCuboid>;
    Cylinder: ConstructorParameters<typeof alt.ColshapeCylinder>;
    Polygon: ConstructorParameters<typeof alt.ColshapePolygon>;
    Rectangle: ConstructorParameters<typeof alt.ColshapeRectangle>;
    Sphere: ConstructorParameters<typeof alt.ColshapeSphere>;
};

const DEFAULT_COOLDOWN = 1000;
const DEFAULT_KEY = 69; // E

const messenger = useMessenger();
const colshapes: { [uid: string]: alt.Colshape } = {};
const sessionKey = 'colshape-identifier';
let currentInteraction: string;
let timeout = Date.now();

function onCreate<K extends keyof ColshapeTypes>(uid: string, type: K, args: ColshapeTypes[K]) {
    if (colshapes[uid]) {
        try {
            colshapes[uid].destroy();
        } catch (err) {}

        delete colshapes[uid];
    }

    switch (type) {
        case 'Circle':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapeCircle(...args);
            break;
        case 'Cuboid':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapeCuboid(...args);
            break;
        case 'Cylinder':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapeCylinder(...args);
            break;
        case 'Polygon':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapePolygon(...args);
            break;
        case 'Rectangle':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapeRectangle(...args);
            break;
        case 'Sphere':
            // @ts-ignore
            colshapes[uid] = new alt.ColshapeSphere(...args);
            break;
    }

    colshapes[uid].setMeta(sessionKey, uid);
}

function onDestroy(uid: string) {
    if (!colshapes[uid]) {
        return;
    }

    try {
        colshapes[uid].destroy();
    } catch (err) {}

    delete colshapes[uid];
}

function onEnter(colshape: alt.Colshape, entity: alt.Entity) {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!colshape.hasMeta(sessionKey)) {
        return;
    }

    currentInteraction = colshape.getMeta(sessionKey) as string;
    alt.emitServer(Events.controllers.interactionLocal.onEnter, currentInteraction);
}

function onLeave(colshape: alt.Colshape, entity: alt.Entity) {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!colshape.hasMeta(sessionKey)) {
        return;
    }

    const uid = colshape.getMeta(sessionKey) as string;
    alt.emitServer(Events.controllers.interactionLocal.onLeave, uid);
    currentInteraction = undefined;
}

function on(key: alt.KeyCode) {
    if (!currentInteraction) {
        return;
    }

    if (DEFAULT_KEY !== key) {
        return;
    }

    if (timeout > Date.now()) {
        return;
    }

    if (messenger.isChatFocused()) {
        return;
    }

    timeout = Date.now() + DEFAULT_COOLDOWN;
    alt.emitServer(Events.controllers.interactionLocal.on, currentInteraction);
}

alt.onServer(Events.controllers.interactionLocal.create, onCreate);
alt.onServer(Events.controllers.interactionLocal.destroy, onDestroy);
alt.on('entityEnterColshape', onEnter);
alt.on('entityLeaveColshape', onLeave);
alt.on('keyup', on);
