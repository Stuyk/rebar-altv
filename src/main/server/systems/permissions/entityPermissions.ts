import * as alt from 'alt-server';
import { Permission, PermissionOptions } from '@Shared/types/index.js';
import { useAccount, useCharacter } from '@Server/document/index.js';
import { usePermissions } from '@Server/systems/permissions/usePermissions.js';

function evaluatePermission(permission: Permission, hasPermission: (perm: string) => boolean): boolean {
    if (typeof permission === 'string') {
        return hasPermission(permission);
    } else if (Array.isArray(permission)) {
        return permission.every((perm) => hasPermission(perm));
    } else if ('and' in permission) {
        return permission.and.every((perm) => evaluatePermission(perm, hasPermission));
    } else if ('or' in permission) {
        return permission.or.some((perm) => evaluatePermission(perm, hasPermission));
    }
    return false;
}

export function useEntityPermissions<T extends PermissionOptions>(entity: T) {
    function check(player: alt.Player): boolean {
        const rCharacter = useCharacter(player);
        const rAccount = useAccount(player);
        if (!rAccount.isValid() && !rCharacter.isValid()) return false;
        const permissions = usePermissions(player);
        return evaluatePermission(entity.permissions, (perm) => permissions.hasPermission(perm));
    }

    return { check };
}
