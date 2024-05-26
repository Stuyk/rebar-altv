import * as alt from 'alt-server';
import { useRebar } from '../index.js';

const Rebar = useRebar();

function hasPermission(player: alt.Player, accountPermissions: string[], characterPermissions: string[]) {
    const rPlayer = Rebar.usePlayer(player);
    if (!rPlayer.isValid()) {
        return false;
    }

    const permissions = Rebar.permission.usePermission(player);
    if (permissions.hasOne('account', accountPermissions)) {
        return true;
    }

    if (permissions.hasOne('character', characterPermissions)) {
        return true;
    }

    return false;
}

export function useProtectCallback(callback: Function, permission: { character?: string[]; account?: string[] }) {
    return (player: alt.Player, ...args: any[]) => {
        if (!hasPermission(player, permission.account ?? [], permission.character ?? [])) {
            return;
        }

        callback(player, ...args);
    };
}
