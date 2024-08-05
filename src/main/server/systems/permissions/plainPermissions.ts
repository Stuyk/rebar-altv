import { PermissionsDocumentMixin } from '@Shared/types/index.js';

export function usePlainPermission<T extends PermissionsDocumentMixin>(document: T) {
    /**
     * Grants a permission to a player.
     *
     * @param {string} permission The permission to grant.
     * @return The part of document with the permission granted.
     */
    function grant(permission: string): PermissionsDocumentMixin | null {
        if (!document.permissions) {
            document.permissions = [];
        }
        if (document.permissions.includes(permission)) {
            return null;
        }

        document.permissions.push(permission);
        return { permissions: document.permissions };
    }

    /**
     * Checks if a player has a permission.
     *
     * @param {string} permission The permission to check.
     * @return {boolean} Whether the player has the permission.
     */
    function check(permission: string): boolean {
        return document.permissions.includes(permission);
    }

    /**
     * Revokes a permission from a player.
     *
     * @param {string} permission The permission to revoke.
     * @return The document with the permission revoked.
     */
    function revoke(permission: string): PermissionsDocumentMixin | null {
        const index = document.permissions.indexOf(permission);
        if (index === -1) {
            return null;
        }
        document.permissions.splice(index, 1);
        return { permissions: document.permissions };
    }

    return {
        grant,
        check,
        revoke,
    };
}
