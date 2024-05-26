import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { useMessenger } from '../system/messenger.js';

type InteractionCallback = (uid: string, pos: alt.Vector3) => void;

const messenger = useMessenger();
const DEFAULT_COOLDOWN = 1000;
const DEFAULT_KEY = 69; // E
const onEnterCallbacks: InteractionCallback[] = [];
const onLeaveCallbacks: InteractionCallback[] = [];

let timeout = Date.now();
let message: string | undefined;
let uid: string | undefined;
let pos: alt.Vector3;

function handleKeyPress(key: alt.KeyCode) {
    if (!uid) {
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
    alt.emitServer(Events.controllers.interaction.trigger, uid);
}

function handleClear() {
    for (let cb of onLeaveCallbacks) {
        cb(uid, pos);
    }

    uid = undefined;
    message = undefined;
    pos = undefined;

    alt.off('keyup', handleKeyPress);
}

function handleSet(_uid: string, _message: string | undefined, _pos: alt.Vector3) {
    for (let cb of onEnterCallbacks) {
        cb(uid, pos);
    }

    uid = _uid;
    message = _message;
    pos = _pos;

    alt.on('keyup', handleKeyPress);
}

export function useClientInteraction() {
    function onEnter(cb: InteractionCallback) {
        onEnterCallbacks.push(cb);
    }

    function onLeave(cb: InteractionCallback) {
        onLeaveCallbacks.push(cb);
    }

    return {
        onEnter,
        onLeave,
    };
}

alt.log(`Controllers - Loaded Interaction Handler`);
alt.onServer(Events.controllers.interaction.clear, handleClear);
alt.onServer(Events.controllers.interaction.set, handleSet);
alt.on('keyup', handleKeyPress);
