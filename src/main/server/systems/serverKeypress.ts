import * as alt from 'alt-server';
import { useRebar } from '../index.js';
import { Events } from '../../shared/events/index.js';

type OnKeybind = (player: alt.Player) => void;
type KeybindInfo = { callback: OnKeybind; uid: string };

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();
const callbacks: { [key: string]: { down: KeybindInfo[]; up: KeybindInfo[] } } = {};

function handleKeyUp(player: alt.Player, key: number) {
    if (!callbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-up-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-up-${key}`, Date.now() + 500);
    for (let kb of callbacks[key].up) {
        kb.callback(player);
    }
}

function handleKeyDown(player: alt.Player, key: number) {
    if (!callbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-down-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-down-${key}`, Date.now() + 500);
    for (let kb of callbacks[key].down) {
        kb.callback(player);
    }
}

function updateKeypressForPlayer(player: alt.Player) {
    player.emit(Events.systems.keypress.update, Object.keys(callbacks));
}

function updateKeypresses() {
    for (let player of alt.Player.all) {
        updateKeypressForPlayer(player);
    }
}

export function useKeypress() {
    function on(key: number, callbackUp: OnKeybind, callbackDown: OnKeybind) {
        const uid = Rebar.utility.uid.generate();

        if (!callbacks[key]) {
            callbacks[key] = {
                up: [],
                down: [],
            };
        }

        callbacks[key].up.push({ uid, callback: callbackUp });
        callbacks[key].down.push({ uid, callback: callbackDown });
        updateKeypresses();
        return uid;
    }

    function off(key: number, uid: string) {
        if (!callbacks[key]) {
            return;
        }

        const upIndex = callbacks[key].up.findIndex((x) => x.uid === uid);
        if (upIndex >= 0) {
            callbacks[key].up.splice(upIndex, 1);
        }

        const downIndex = callbacks[key].down.findIndex((x) => x.uid === uid);
        if (downIndex >= 0) {
            callbacks[key].up.splice(downIndex, 1);
        }

        if (callbacks[key].up.length <= 0 && callbacks[key].down.length <= 0) {
            delete callbacks[key];
        }

        updateKeypresses();
    }

    return {
        off,
        on,
        updateKeypressForPlayer,
    };
}

RebarEvents.on('character-bound', updateKeypressForPlayer);

alt.onClient(Events.systems.keypress.invokeUp, handleKeyUp);
alt.onClient(Events.systems.keypress.invokeDown, handleKeyDown);
