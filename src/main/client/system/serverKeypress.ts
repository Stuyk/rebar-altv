import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';
import { useMessenger } from './messenger.js';

const messenger = useMessenger();
const validKeys: Map<number, boolean> = new Map();
const nextValidUpPress: { [key: string]: number } = {};
const nextValidDownPress: { [key: string]: number } = {};
const keyStates: { [key: number]: { isPressed: boolean; pressStartTime: number; pressDuration: number } } = {};
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

    if (messenger.isChatFocused()) {
        return;
    }

    if (alt.isConsoleOpen()) {
        return;
    }

    if (nextValidUpPress[key] && Date.now() < nextValidUpPress[key]) {
        return;
    }

    if (keyStates[key]) {
        keyStates[key].isPressed = false;
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

    if (!keyStates[key]) {
        keyStates[key] = { isPressed: false, pressStartTime: 0, pressDuration: 0 };
    }

    keyStates[key].isPressed = true;
    keyStates[key].pressStartTime = Date.now();
    nextValidDownPress[key] = Date.now() + 500;
    alt.emitServer(Events.systems.keypress.invokeDown, key);
}

alt.onServer(Events.systems.keypress.update, handleUpdate);
alt.on('keyup', handleKeyup);
alt.on('keydown', handleKeyDown);


alt.everyTick(() => {
    const currentTime = Date.now();

    for (const key in keyStates) {
        const state = keyStates[key];

        if (state.isPressed) {
            state.pressDuration = currentTime - state.pressStartTime;

            if (state.pressDuration >= requiredPressDuration) {
                state.isPressed = false;
                state.pressStartTime = 0;
                state.pressDuration = 0;
                alt.emitServer(Events.systems.keypress.invokeHold, parseInt(key));
            }
        } else {
            state.pressStartTime = 0;
            state.pressDuration = 0;
        }
    }
});
