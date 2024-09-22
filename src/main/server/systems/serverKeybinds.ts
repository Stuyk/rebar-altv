import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';
import * as Utility from '@Shared/utility/index.js';

type OnKeybind = (player: alt.Player) => void;
type KeybindInfo = { callback: OnKeybind; uid: string };

const callbacks: { [key: string]: KeybindInfo[] } = {};

function handleKeybind(player: alt.Player, key: number) {
    if (!callbacks[key]) {
        return;
    }

    const nextCall = (player.getMeta(`keybind-${key}`) as number) ?? 0;
    if (Date.now() < nextCall) {
        return;
    }

    player.setMeta(`keybind-${key}`, Date.now() + 500);
    for (let kb of callbacks[key]) {
        kb.callback(player);
    }
}

function updateKeybindForPlayer(player: alt.Player) {
    player.emit(Events.systems.keybinds.update, Object.keys(callbacks));
}

function updateKeybinds() {
    for (let player of alt.Player.all) {
        updateKeybindForPlayer(player);
    }
}

export function useKeybinder() {
    function on(key: number, callback: OnKeybind) {
        const uid = Utility.uid.generate();

        if (!callbacks[key]) {
            callbacks[key] = [];
        }

        callbacks[key].push({ uid, callback });
        updateKeybinds();
        return uid;
    }

    function off(key: number, uid: string) {
        if (!callbacks[key]) {
            return;
        }

        const index = callbacks[key].findIndex((x) => x.uid === uid);
        if (index <= -1) {
            return;
        }

        callbacks[key].splice(index, 1);

        if (callbacks[key].length <= 0) {
            delete callbacks[key];
        }

        updateKeybinds();
    }

    return {
        off,
        on,
        updateKeybindForPlayer,
    };
}

alt.on('rebar:playerCharacterBound', updateKeybindForPlayer);
alt.onClient(Events.systems.keybinds.invoke, handleKeybind);
