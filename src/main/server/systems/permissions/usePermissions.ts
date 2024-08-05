import * as alt from 'alt-server';
import { useAccount, useCharacter } from '@Server/document/index.js';

export function usePermissions(player: alt.Player) {
    const account = useAccount(player);
    const character = useCharacter(player);

    const hasPermission = (permission: string): boolean => {
        if (account.isValid()) {
            if (account.permissions.has(permission)) {
                return true;
            }
        }

        if (character.isValid()) {
            if (character.permissions.has(permission)) {
                return true;
            }
        }

        return false;
    };

    const listAllPermissions = (): string[] => {
        const characterPermissions = character.permissions.list();
        const accountPermissions = account.permissions.list();
        return [...new Set([...characterPermissions, ...accountPermissions])];
    };

    return {
        hasPermission,
        listAllPermissions,
        account: {
            permissions: account.permissions,
            groups: account.groups,
        },
        character: {
            permissions: character.permissions,
            groups: character.groups,
        },
    };
}
