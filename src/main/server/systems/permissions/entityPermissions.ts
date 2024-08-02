import * as alt from 'alt-server';
import {Permission, PermissionOptions} from "@Shared/types/index.js";
import {useAccount, useCharacter} from "@Server/document/index.js";


function evaluatePermission(permission: Permission, hasPermission: (perm: string) => boolean): boolean {
    if (typeof permission === 'string') {
        return hasPermission(permission);
    } else if (Array.isArray(permission)) {
        return permission.every(perm => hasPermission(perm));
    } else if ('and' in permission) {
        return permission.and.every(perm => evaluatePermission(perm, hasPermission));
    } else if ('or' in permission) {
        return permission.or.some(perm => evaluatePermission(perm, hasPermission));
    }
    return false;
}


export function useEntityPermission<T extends PermissionOptions>(entity: T) {
    function hasPermission(player: alt.Player, permission: string): boolean {
        const rCharacter = useCharacter(player);
        const rAccount = useAccount(player);

        if (rCharacter.isValid()) {
            if (rCharacter.permissions.has(permission)) {
                return true;
            }
        }

        if (rAccount.isValid()) {
            if (rAccount.permissions.has(permission)) {
                return true;
            }
        }

        return false;
    }

    async function check(player: alt.Player): Promise<boolean> {
        const rCharacter = useCharacter(player);
        const rAccount = useAccount(player);
        if (!rAccount.isValid() || !rCharacter.isValid()) return false;

        let allowed = true;

        if (entity?.permissions?.character) {
            allowed = allowed && evaluatePermission(entity.permissions.character, perm => hasPermission(player, perm));
        }

        if (entity?.permissions?.account) {
            allowed = allowed && evaluatePermission(entity.permissions.account, perm => hasPermission(player, perm));
        }

        return allowed;
    }

    return {check};
}
