import * as alt from 'alt-server';
import { usePlayer } from '../player/index.js';

function hasPermission(
    player: alt.Player,
    accountPermissions: string[],
    characterPermissions: string[],
    groupPermissions: { [key: string]: string[] },
) {
    const rPlayer = usePlayer(player);
    if (!rPlayer.isValid()) {
        return false;
    }

    const accPerms = rPlayer.character.getField('permissions') ?? [];
    const charPerms = rPlayer.character.getField('permissions') ?? [];
    const groupPerms = rPlayer.character.getField('groups') ?? {};

    for (let perm of accountPermissions) {
        if (!accPerms.includes(perm)) {
            continue;
        }

        return true;
    }

    for (let perm of characterPermissions) {
        if (!charPerms.includes(perm)) {
            continue;
        }

        return true;
    }

    for (let key of Object.keys(groupPermissions)) {
        // Does not belong to group
        if (!groupPerms[key]) {
            continue;
        }

        // Belongs to group
        for (let perm of groupPermissions[key]) {
            if (!groupPerms[key].includes(perm)) {
                continue;
            }

            return true;
        }
    }

    return false;
}

export function useProtectCallback(
    callback: Function,
    permission: { character?: string[]; account?: string[]; group?: { [key: string]: string[] } },
) {
    return (player: alt.Player, ...args: any[]) => {
        if (!hasPermission(player, permission.account ?? [], permission.character ?? [], permission.group ?? {})) {
            return;
        }

        callback(player, ...args);
    };
}
