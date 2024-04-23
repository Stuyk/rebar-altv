import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';

const DEFAULT_KEY = 69; // E

let message: string | undefined;
let uid: string | undefined;

function handleKeyPress(key: alt.KeyCode) {
    if (!uid) {
        return;
    }

    if (DEFAULT_KEY !== key) {
        return;
    }

    alt.emitServer(Events.controllers.interaction.trigger, uid);
}

function handleClear() {
    uid = undefined;
    message = undefined;

    alt.off('keyup', handleKeyPress);
}

function handleSet(_uid: string, _message: string | undefined) {
    uid = _uid;
    message = _message;

    alt.on('keyup', handleKeyPress);
}

alt.on('keyup', handleKeyPress);
alt.onServer(Events.controllers.interaction.clear, handleClear);
alt.onServer(Events.controllers.interaction.set, handleSet);
