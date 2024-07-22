import * as alt from 'alt-server';
import { usePermission } from './permission.js';
import { usePermissionGroup } from './permissionGroup.js';

type DocumentType = 'character' | 'account';
type DocumentGetter = () => Object | undefined;
type DocumentSetter = (fieldName: string, value: any) => Promise<void>;

/**
 * Permission proxy for useCharacter/useAccount/useVehicle.
 * 
 * @export
 * @param {alt.Player} player
 * @param {DocumentType} documentType Document type to handle permissions for.
 * @param {DocumentGetter} getter Getter function to get the document.
 * @param {DocumentSetter} setter Setter function to set the document.
 */
export function usePermissionProxy(
    player: alt.Player,
    documentType: DocumentType,
    getter: DocumentGetter,
    setter: DocumentSetter,
) {
    const permissions = {
        /**
         * Proxies the add permission function.
         *
         * @param {string} permission
         * @returns {Promise<boolean>}
         */
        addPermission: async (permission: string): Promise<boolean> => {
            if (!player.valid) return false;
            const perm = usePermission(player);
            return await perm.add(documentType, permission);
        },

        /**
         * Proxies the remove permission function.
         *
         * @param {string} permission
         * @returns {Promise<boolean>}
         */
        removePermission: async (permission: string): Promise<boolean> => {
            if (!player.valid) return false;
            const perm = usePermission(player);
            return await perm.remove(documentType, permission);
        },

        /**
         * Proxies the has permission function.
         *
         * @param {string} permission
         * @returns {boolean}
         */
        hasPermission: (permission: string): boolean => {
            if (!player.valid) return false;
            const perm = usePermission(player);
            return perm.has(documentType, permission);
        },

        /**
         * Proxies the has all permission function.
         *
         * @param {string[]} permissions
         * @returns {boolean}
         */
        hasAllPermissions: (permissions: string[]): boolean => {
            if (!player.valid) return false;
            const perm = usePermission(player);
            return perm.hasAll(documentType, permissions);
        },

        /**
         * Proxies the has any permission function.
         *
         * @param {string[]} permissions
         * @returns {boolean}
         */
        hasAnyPermission: (permissions: string[]): boolean => {
            if (!player.valid) return false;
            const perm = usePermission(player);
            return perm.hasOne(documentType, permissions);
        },

        /**
         * Proxies the clear permissions function.
         *
         * @returns {void}
         */
        clear: (): void => {
            if (!player.valid) return;
            const perm = usePermission(player);
            perm.clear(documentType);
        },
    };

    const groupPermissions = {
        /**
         * Proxies the add group function.
         *
         * @param {string} groupName Group name to add. 
         * @param {string[]} permissions Permissions to add to group.
         * @returns {Promise<boolean>} Returns true if successful.
         */
        addPermissions: async (groupName: string, permissions: string[] | string): Promise<boolean> => {
            const data = getter();
            if (typeof data === 'undefined') return false;

            if (typeof permissions === 'string') {
                permissions = [permissions];
            }

            const perm = usePermissionGroup(data);
            const updatedDocument = perm.addGroupPerm(groupName, permissions);
            await setter('groups', updatedDocument.groups);
            return true;
        },
        /**
         * Proxies the remove permission from group function.
         * 
         * @param {string} groupName Group name to remove permission from.
         * @param {string[]} permissions Permissions to remove from group.
         * @returns {Promise<boolean>} Returns true if successful.
         */
        removePermissions: async (groupName: string, permissions: string[]): Promise<boolean> => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            const updatedDocument = perm.removeGroupPerm(groupName, permissions);
            await setter('groups', updatedDocument.groups);
            return true;
        },
        /**
         * Proxies the remove group function.
         * 
         * @param {string} groupName Group name to remove.
         * @returns {Promise<boolean>} Returns true if successful.
         */
        removeGroup: async (groupName: string): Promise<boolean> => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            const updatedDocument = perm.removeGroup(groupName);
            await setter('groups', updatedDocument.groups);
            return true;
        },
        /**
         * Proxies the has group function.
         * 
         * @param {string} groupName Group name to check.
         * @returns {boolean} Returns true if the group exists.
         */
        hasGroup: (groupName: string): boolean => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            return perm.hasGroup(groupName);
        },
        /**
         * Proxies the has group permission function.
         * 
         * @param {string} groupName Group name to check.
         * @param {string} permission Permission to check.
         * @returns {boolean} Returns true if the group has the permission.
         */
        hasGroupPerm: (groupName: string, permission: string): boolean => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            return perm.hasGroupPerm(groupName, permission);
        },
        /**
         * Proxies the has at least one group permission function.
         * 
         * @param {string} groupName Group name to check.
         * @param {string[]} permissions Permissions to check.
         * @returns {boolean} Returns true if the group has at least one permission.
         */
        hasAtLeastOneGroupPerm: (groupName: string, permissions: string[]): boolean => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            return perm.hasAtLeastOneGroupPerm(groupName, permissions);
        },
        /**
         * Proxies the has at least one group with specific permission function.
         * 
         * @param {Record<string, string[]>} groups Groups to check.
         * @returns {boolean} Returns true if at least one group has specific permission.
         */
        hasAtLeastOneGroupWithSpecificPerm: (groups: Record<string, string[]>): boolean => {
            const data = getter();
            if (typeof data === 'undefined') return false;
            const perm = usePermissionGroup(data);
            return perm.hasAtLeastOneGroupWithSpecificPerm(groups);
        },
    }

    return { permissions, groupPermissions };
}
