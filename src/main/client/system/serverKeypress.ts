import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { useMessenger } from './messenger.js';

const messenger = useMessenger();
const validKeys: Map<number, boolean> = new Map();
const nextValidUpPress: { [key: string]: number } = {};
const nextValidDownPress: { [key: string]: number } = {};
const keyPressTracker: { [key: number]: number } = {};
const requiredPressDuration = 2000;

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

    if (keyPressTracker[key]) {
        delete keyPressTracker[key];
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

    if (!keyPressTracker[key]) {
        keyPressTracker[key] = Date.now() + requiredPressDuration;
    }

    nextValidDownPress[key] = Date.now() + 500;
    alt.emitServer(Events.systems.keypress.invokeDown, key);
}

function handleKeyHold() {
    if (!alt.gameControlsEnabled()) {
        return;
    }

    if (messenger.isChatFocused()) {
        return;
    }

    if (alt.isConsoleOpen()) {
        return;
    }

    const keyPresses = { ...keyPressTracker };
    for (const key in keyPresses) {
        const invokeTime = keyPressTracker[key];

        if (Date.now() < invokeTime) {
            continue;
        }

        if (keyPressTracker[key]) {
            delete keyPressTracker[key];
        }

        alt.emitServer(Events.systems.keypress.invokeHold, parseInt(key));
    }
}

alt.onServer(Events.systems.keypress.update, handleUpdate);
alt.everyTick(handleKeyHold);
alt.on('keyup', handleKeyup);
alt.on('keydown', handleKeyDown);
