export interface PermissionMeta {
    /**
     * The time the permission was granted.
     * @type {number}
     */
    startAt: number;

    /**
     * The duration of the permission.
     * @type {number}
     */
    duration: number;
}

export interface PermissionsDocumentMixin {
    /**
     * The permissions associated with this document.
     * @type {string[]}
     */
    permissions?: string[];

    /**
     * The permissions metadata associated with this document.
     * @type {Record<string, { startAt: number; duration: number }>}
     */
    permissionsMeta?: Record<string, PermissionMeta>;
}


export interface GroupsDocumentMixin {
    /**
     * The groups associated with this document.
     * @type {string[]}
     */
    groups?: string[];
}

export interface PermissionOptions {
    /**
     * The permissions that are allowed to lock/unlock the door.
     *
     * @type {Record<'account' | 'character', string[]>}
     */
    permissions: {
        account: string[];
        character: string[];
    };

    /**
     * The groups that are allowed to lock/unlock the door.
     *
     * @type {Record<'account' | 'character', string[]>}
     */
    groups: {
        account: string[];
        character: string[];
    };
}
