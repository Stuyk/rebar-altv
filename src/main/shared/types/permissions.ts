export interface PermissionsDocumentMixin {
    /**
     * The permissions associated with this document.
     * @type {string[]}
     */
    permissions?: string[];
}


export interface GroupsDocumentMixin {
    /**
     * The groups associated with this document.
     * @type {string[]}
     */
    groups?: string[];
}

export type Permission = string | string[] | PermissionLogic;
type PermissionLogic = And | Or;
type And = { and: Permission[] };
type Or = { or: Permission[] };

export interface PermissionOptions {
    /**
     * Permissions required to access this entity.
     *
     * @type {Permission}
     */
    permissions?: Permission;
}
