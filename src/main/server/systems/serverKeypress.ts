import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import * as Utility from '@Shared/utility/index.js';

type OnKeybind = (player: alt.Player) => void;
type KeybindInfo = { callback: OnKeybind; uid: string };

const keyCallbacks: { [key: string]: { down: KeybindInfo[]; up: KeybindInfo[]; hold: KeybindInfo[] } } = {};

function handleKeyUp(player: alt.Player, key: number) {
    if (!keyCallbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-up-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-up-${key}`, Date.now() + 500);
    for (let kb of keyCallbacks[key].up) {
        kb.callback(player);
    }
}

function handleKeyDown(player: alt.Player, key: number) {
    if (!keyCallbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-down-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-down-${key}`, Date.now() + 500);
    for (let kb of keyCallbacks[key].down) {
        kb.callback(player);
    }
}

function handleKeyHold(player: alt.Player, key: number) {
    if (!keyCallbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-hold-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-hold-${key}`, Date.now() + 500);
    for (let kb of keyCallbacks[key].hold) {
        kb.callback(player);
    }
}

function updateKeypressForPlayer(player: alt.Player) {
    player.emit(Events.systems.keypress.update, Object.keys(keyCallbacks));
}

function updateKeypresses() {
    for (let player of alt.Player.all) {
        updateKeypressForPlayer(player);
    }
}

export function useKeypress() {
    function on(key: number, callbackUp: OnKeybind, callbackDown: OnKeybind) {
        const uid = Utility.uid.generate();

        if (!keyCallbacks[key]) {
            keyCallbacks[key] = {
                up: [],
                down: [],
                hold: [],
            };
        }

        keyCallbacks[key].up.push({ uid, callback: callbackUp });
        keyCallbacks[key].down.push({ uid, callback: callbackDown });
        updateKeypresses();
        return uid;
    }

    function onHold(key: number, callbacks: { hold: OnKeybind; up?: OnKeybind; down?: OnKeybind }) {
        const uid = Utility.uid.generate();

        if (!keyCallbacks[key]) {
            keyCallbacks[key] = {
                up: [],
                down: [],
                hold: [],
            };
        }

        keyCallbacks[key].down.push({
            uid,
            callback: (player) => {
                player.setMeta(`keyhold-${uid}`, Date.now() + 2000);
                if (!callbacks.down) {
                    return;
                }

                callbacks.down(player);
            },
        });

        keyCallbacks[key].up.push({
            uid,
            callback: (player) => {
                player.deleteMeta(`keyhold-${uid}`);
                if (!callbacks.up) {
                    return;
                }

                callbacks.up(player);
            },
        });

        keyCallbacks[key].hold.push({
            uid,
            callback: (player) => {
                const invokeTime = player.getMeta(`keyhold-${uid}`) as number;
                if (!invokeTime) {
                    return;
                }

                if (Date.now() < invokeTime) {
                    return;
                }

                player.deleteMeta(`keyhold-${uid}`);
                callbacks.hold(player);
            },
        });

        return uid;
    }

    function off(key: number, uid: string) {
        if (!keyCallbacks[key]) {
            return;
        }

        const upIndex = keyCallbacks[key].up.findIndex((x) => x.uid === uid);
        if (upIndex >= 0) {
            keyCallbacks[key].up.splice(upIndex, 1);
        }

        const downIndex = keyCallbacks[key].down.findIndex((x) => x.uid === uid);
        if (downIndex >= 0) {
            keyCallbacks[key].up.splice(downIndex, 1);
        }

        const holdIndex = keyCallbacks[key].hold.findIndex((x) => x.uid === uid);
        if (holdIndex >= 0) {
            keyCallbacks[key].up.splice(holdIndex, 1);
        }

        if (
            keyCallbacks[key].up.length <= 0 &&
            keyCallbacks[key].down.length <= 0 &&
            keyCallbacks[key].hold.length <= 0
        ) {
            delete keyCallbacks[key];
        }

        updateKeypresses();
    }

    return {
        off,
        on,
        onHold,
        updateKeypressForPlayer,
    };
}

alt.on('rebar:playerCharacterBound', updateKeypressForPlayer);
alt.onClient(Events.systems.keypress.invokeUp, handleKeyUp);
alt.onClient(Events.systems.keypress.invokeDown, handleKeyDown);
alt.onClient(Events.systems.keypress.invokeHold, handleKeyHold);
