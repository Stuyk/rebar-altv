import * as alt from 'alt-server';
import { useGlobal } from '@Server/document/global.js';
import { usePlayersGetter } from '@Server/getters/players.js';
import { useAccount, useCharacter } from '@Server/document/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames } from '@Server/document/shared.js';

interface PermissionGroup {
    permissions: Array<string>;
    inherits?: string;
    version?: number;
}

interface PermissionGroupConfig {
    [groupName: string]: PermissionGroup;
}

let initialized = false;
let permissionGroups: Awaited<ReturnType<typeof useGlobal<PermissionGroupConfig>>>;
const permissionIndex: Map<string, Set<string>> = new Map();
const database = useDatabase();

class InternalFunctions {
    static async init() {
        if (initialized) return;
        initialized = true;
        permissionGroups = await useGlobal<PermissionGroupConfig>('permissionGroups');
        this.buildIndex();
    }

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
            if (['_id', 'identifier'].includes(groupName)) continue;

            const permissions = new Set<string>();
            this.addPermissionsToSet(groupName, permissions);
            permissionIndex.set(groupName, permissions);
        }
    }
}

export function usePermissionGroup() {
    async function add(groupName: string, options: PermissionGroup): Promise<boolean> {
        const existingGroup = permissionGroups.getField(groupName);

        if (existingGroup) {
            if (!options.version && existingGroup.version) {
                // We have no version in the new group, but we have a version in the existing group.
                alt.logWarning(
                    `[Group: ${groupName}] Group was updated in runtime previously. Prefer to update the code to include all the changes in the group.`,
                );
                return false;
            } else if (options.version && existingGroup.version && options.version <= existingGroup.version) {
                // The version is lower than the existing version.
                if (options.version < existingGroup.version) {
                    alt.logWarning(
                        `[Group: ${groupName}] Group version is lower than the version in database. Prefer to update the code to include all the changes in the group.`,
                    );
                }
                return false;
            }
        }
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

        // Remove the group from all accounts that are online.
        const accountPromises = usePlayersGetter()
            .memberOfGroup('account', groupName)
            .map(async (player: alt.Player) => {
                const account = useAccount(player);
                await account.groups.remove(groupName);
            });

        // Remove the group from all characters that are online.
        const characterPromises = usePlayersGetter()
            .memberOfGroup('character', groupName)
            .map(async (player: alt.Player) => {
                const character = useCharacter(player);
                await character.groups.remove(groupName);
            });

        await Promise.all([
            ...accountPromises,
            ...characterPromises,
            // Remove the group from all accounts that are offline.
            database.updateMany({ groups: groupName }, { $pull: { groups: groupName } }, CollectionNames.Accounts),
            // Remove the group from all characters that are offline.
            database.updateMany({ groups: groupName }, { $pull: { groups: groupName } }, CollectionNames.Characters),
        ]);
        return true;
    }

    async function addPermissions(groupName: string, permission: string[]): Promise<boolean> {
        const existingGroup = permissionGroups.getField(groupName);
        if (!existingGroup) {
            return false;
        }
        const newPermissions = existingGroup.permissions.concat(
            permission.filter((x) => !existingGroup.permissions.includes(x)),
        );

        let version = existingGroup.version || 0;
        version++;

        await permissionGroups.set(groupName, { ...existingGroup, permissions: newPermissions, version });
        InternalFunctions.buildIndex();
        return true;
    }

    async function removePermissions(groupName: string, permissions: string[]) {
        const existingGroup = permissionGroups.getField(groupName);
        if (!existingGroup) {
            return false;
        }
        const newPermissions = existingGroup.permissions.filter((x) => !permissions.includes(x));

        let version = existingGroup.version || 0;
        version++;

        await permissionGroups.set(groupName, { ...existingGroup, permissions: newPermissions, version });
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

    return { add, remove, addPermissions, removePermissions, groupHasPermission, groupsToPlainPermissions };
}

InternalFunctions.init();
