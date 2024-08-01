import {PermissionMeta, PermissionsDocumentMixin} from "@Shared/types/index.js";

export interface PlainPermissionOptions extends PermissionMeta {
    modifier: 'accumulate' | 'overwrite' | 'deny';
}

export function usePlainPermission<T extends PermissionsDocumentMixin>(document: T) {

    /**
     * Grants a permission to a player.
     *
     * @param {string} permission The permission to grant.
     * @param {PlainPermissionOptions} options Options for temporary permissions.
     * @return The document with the permission granted.
     */
    function grant(permission: string, options: PlainPermissionOptions = undefined): [boolean, PermissionsDocumentMixin | null] {
        if (!document.permissions) {
            document.permissions = [];
        }
        if (document.permissions.includes(permission) && (!options || options.modifier === 'deny')) {
            return [false, null];
        }

        if (options) {
            if (!document.permissionsMeta) {
                document.permissionsMeta = {};
            }
            let justCreated = false;
            if (!document.permissionsMeta[permission]) {
                document.permissionsMeta[permission] = {
                    startAt: options.startAt || Date.now(),
                    duration: options.duration,
                };
                justCreated = true;
            }
            if (options.modifier === 'overwrite' && !justCreated) {
                document.permissionsMeta[permission] = {
                    startAt: options.startAt || Date.now(),
                    duration: options.duration,
                };
            } else if (options.modifier === 'accumulate' && !justCreated) {
                document.permissionsMeta[permission].duration += options.duration;
            }
        }

        if (!document.permissions.includes(permission)) {
            document.permissions.push(permission);
        }
        return [true, {permissions: document.permissions, permissionsMeta: document.permissionsMeta}];
    }

    /**
     * Checks if a player has a permission.
     *
     * @param {string} permission The permission to check.
     * @return {boolean} Whether the player has the permission.
     */
    function check(permission: string): boolean {
        if (!document.permissions.includes(permission)) {
            return false;
        }
        const hasPermission = document.permissions.includes(permission);
        if (hasPermission && document?.permissionsMeta?.[permission]) {
            const {startAt, duration} = document.permissionsMeta[permission];
            return Date.now() < startAt + duration;
        }
        return hasPermission;
    }

    /**
     * Revokes a permission from a player.
     *
     * @param {string} permission The permission to revoke.
     * @return The document with the permission revoked.
     */
    function revoke(permission: string): [boolean, PermissionsDocumentMixin] {
        if (!document.permissions.includes(permission)) {
            return [false, null];
        }
        document.permissions = document.permissions.filter((perm) => perm !== permission);
        if (document.permissionsMeta[permission]) {
            delete document.permissionsMeta[permission];
        }
        return [true, {permissions: document.permissions, permissionsMeta: document.permissionsMeta}];
    }

    /**
     * Expires a temporary permission from a player.
     *
     * @param {string} permission The permission to expire.
     * @return {[boolean, PermissionsDocumentMixin]} Whether the permission was expired and the document with the updated permissions.
     */
    function expire(permission: string): [boolean, PermissionsDocumentMixin] {
        if (!document.permissions.includes(permission)) {
            return [false, null];
        }
        if (!document.permissionsMeta[permission]) {
            return [false, null];
        }
        delete document.permissionsMeta[permission];
        document.permissions = document.permissions.filter((perm) => perm !== permission);
        return [true, {permissions: document.permissions, permissionsMeta: document.permissionsMeta}];
    }

    return {
        grant,
        check,
        revoke,
        expire,
    };
}
