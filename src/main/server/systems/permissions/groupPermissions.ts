import {useGlobal} from '@Server/document/global.js';

interface PermissionGroup {
    permissions: Array<string>;
    inherits?: string;
    version?: number;
}

interface PermissionGroupConfig {
    [groupName: string]: PermissionGroup;
}

let initialized = false;
let permissionGroups;
const permissionIndex: Map<string, Set<string>> = new Map();


class InternalFunctions {
    static addPermissionsToSet(groupName: string, permissions: Set<string>, visited: Set<string> = new Set()) {
        if (visited.has(groupName)) {
            throw new Error(`Cyclic dependency detected: ${[...visited, groupName].join(' -> ')}`);
        }
        visited.add(groupName);

        const group = permissionGroups.getField(groupName);
        if (!group) return;

        for (const permission of group.permissions) {
            permissions.add(permission);
        }
        if (group.inherits) {
            this.addPermissionsToSet(group.inherits, permissions, new Set(visited));
        }
    }

    static buildIndex() {
        permissionIndex.clear();
        for (const [groupName, group] of Object.entries(permissionGroups.get())) {
            const permissions = new Set<string>();
            this.addPermissionsToSet(groupName, permissions);
            permissionIndex.set(groupName, permissions);
        }
    }
}


export function usePermissionGroup() {

    async function add(groupName: string, options: PermissionGroup): Promise<boolean> {
        const existingGroup = permissionGroups.getField(groupName);
        if (options.version && existingGroup.version && options.version <= existingGroup.version) {
            // The version is lower than the existing version.
            return false;
        } else if (existingGroup.version && !options.version) {
            // The existing group has a version, but the new group does not.
            return false;
        }
        // The new group has a version, and it is higher than the existing version.
        await permissionGroups.set(groupName, options);
        InternalFunctions.buildIndex();
        return true;
    }

    async function remove(groupName: string): Promise<boolean> {
        const existingGroup = permissionGroups.getField(groupName);
        if (!existingGroup) {
            return false;
        }
        await permissionGroups.unset(groupName);
        InternalFunctions.buildIndex();
        return true;
    }

    async function addPermissions(groupName: string, permission: string[]): Promise<boolean> {
        const existingGroup = permissionGroups.getField(groupName);
        if (!existingGroup) {
            return false;
        }
        const newPermissions = existingGroup.permissions.concat(permission.filter((x) => !existingGroup.permissions.includes(x)));
        await permissionGroups.set(groupName, {...existingGroup, permissions: newPermissions});
        InternalFunctions.buildIndex();
        return true;
    }

    async function removePermissions(groupName: string, permissions: string[]) {
        const existingGroup = permissionGroups.getField(groupName);
        if (!existingGroup) {
            return false;
        }
        const newPermissions = existingGroup.permissions.filter((x) => !permissions.includes(x));
        await permissionGroups.set(groupName, {...existingGroup, permissions: newPermissions});
        InternalFunctions.buildIndex();
        return true;
    }

    function groupHasPermission(groupName: string, permission: string) {
        const permissions = permissionIndex.get(groupName);
        return permissions ? permissions.has(permission) : false;
    }

    function groupsToPlainPermissions(groupNames: string[]): string[] {
        const permissions = new Set<string>();
        for (const groupName of groupNames) {
            const groupPermissions = permissionIndex.get(groupName);
            if (groupPermissions) {
                for (const permission of groupPermissions) {
                    permissions.add(permission);
                }
            }
        }
        return [...permissions];
    }

    return {add, remove, addPermissions, removePermissions, groupHasPermission, groupsToPlainPermissions};
}

if (!initialized) {
    permissionGroups = await useGlobal<PermissionGroupConfig>('permissionGroups');
    InternalFunctions.buildIndex();
    initialized = true;
}
