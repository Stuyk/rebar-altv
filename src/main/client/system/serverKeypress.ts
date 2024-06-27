import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';
import { useMessenger } from './messenger.js';

const messenger = useMessenger();
const validKeys: Map<number, boolean> = new Map();
const nextValidUpPress: { [key: string]: number } = {};
const nextValidDownPress: { [key: string]: number } = {};

function handleUpdate(keys: string[]) {
    validKeys.clear();

    for (let key of keys) {
        validKeys.set(parseInt(key), true);
    }
}

function handleKeyup(key: number) {
    if (!alt.gameControlsEnabled()) {
        return;
    }

    if (!validKeys.has(key)) {
        return;
    }

    if (messenger.isChatFocused()) {
        return;
    }

    if (alt.isConsoleOpen()) {
        return;
    }

    if (nextValidUpPress[key] && Date.now() < nextValidUpPress[key]) {
        return;
    }

    nextValidUpPress[key] = Date.now() + 500;
    alt.emitServer(Events.systems.keypress.invokeUp, key);
}

function handleKeyDown(key: number) {
    if (!alt.gameControlsEnabled()) {
        return;
    }

    if (!validKeys.has(key)) {
        return;
    }

    if (messenger.isChatFocused()) {
        return;
    }

    if (alt.isConsoleOpen()) {
        return;
    }

    if (nextValidDownPress[key] && Date.now() < nextValidDownPress[key]) {
        return;
    }

    nextValidDownPress[key] = Date.now() + 500;
    alt.emitServer(Events.systems.keypress.invokeDown, key);
}

alt.onServer(Events.systems.keypress.update, handleUpdate);
alt.on('keyup', handleKeyup);
alt.on('keydown', handleKeyDown);
