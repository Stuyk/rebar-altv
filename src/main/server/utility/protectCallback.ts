import * as alt from 'alt-server';
import { usePlayer } from '../player/index.js';
import { PermissionOptions } from '@Shared/types/index.js';
import { useEntityPermissions } from '@Server/systems/permissions/entityPermissions.js';

function hasPermission(player: alt.Player, permissionOptions: PermissionOptions) {
    const rPlayer = usePlayer(player);
    if (!rPlayer.isValid()) {
        return false;
    }

    return useEntityPermissions(permissionOptions).check(player);
}

export function useProtectCallback(callback: Function, permissionOptions: PermissionOptions) {
    return (player: alt.Player, ...args: any[]) => {
        if (!hasPermission(player, permissionOptions)) {
            return;
        }

        callback(player, ...args);
    };
}
