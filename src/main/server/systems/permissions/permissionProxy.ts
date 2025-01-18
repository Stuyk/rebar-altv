import * as alt from 'alt-server';
import { usePlainPermission } from '@Server/systems/permissions/plainPermissions.js';
import { usePermissionGroup } from '@Server/systems/permissions/groupPermissions.js';
import { PermissionsDocumentMixin, GroupsDocumentMixin } from '@Shared/types/index.js';

type DocumentGetterResult<T> = T | undefined;
type Document = PermissionsDocumentMixin & GroupsDocumentMixin;
type DocumentGetter<T extends Document> = () => DocumentGetterResult<T>;
type DocumentBulkSetter<T extends Document> = (fields: Partial<T>) => Promise<any>;

type Target = 'character' | 'account';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        ['rebar:permissions:grant']: (entity: alt.Player, permission: string, target: Target) => void;
        ['rebar:permissions:revoke']: (entity: alt.Player, permission: string, target: Target) => void;
        ['rebar:permissions:clear']: (entity: alt.Player, removedPermissions: string[], target: Target) => void;
        ['rebar:permissions:group:add']: (entity: alt.Player, groupName: string, target: Target) => void;
        ['rebar:permissions:group:remove']: (entity: alt.Player, groupName: string, target: Target) => void;
        ['rebar:permissions:group:clear']: (entity: alt.Player, removedGroups: string[], target: Target) => void;
    }
}

export function usePermissionProxy<T extends Document>(
    getter: DocumentGetter<T>,
    bulkSetter: DocumentBulkSetter<T>,
    entity: alt.Player = undefined,
    target: Target = undefined,
) {
    const permissionsList = (): string[] => {
        const document = getter();

        const documentPermissions = document.permissions || [];
        if (typeof document.groups === 'object' && !Array.isArray(document.groups)) {
            alt.logWarning(
                `${target || 'virtual'} document ${document._id} has a groups object instead of an array. Prefer to migrate.`,
            );
            return documentPermissions;
        }
        const groupPermissions = usePermissionGroup().groupsToPlainPermissions(document.groups || []);
        return [...new Set([...documentPermissions, ...groupPermissions])];
    };

    const permissions = {
        grant: async (permission: string): Promise<boolean> => {
            const document = getter();
            const _permissions = usePlainPermission<T>(document).grant(permission);
            if (!_permissions) return false;
            await bulkSetter(_permissions as Partial<T>);
            if (entity) {
                alt.emit('rebar:permissions:grant', entity, permission, target);
            }
            return true;
        },
        revoke: async (permission: string): Promise<boolean> => {
            const document = getter();
            const _permissions = usePlainPermission<T>(document).revoke(permission);
            if (!_permissions) return false;
            await bulkSetter(_permissions as Partial<T>);
            if (entity) {
                alt.emit('rebar:permissions:revoke', entity, permission, target);
            }
            return true;
        },
        clear: async (): Promise<void> => {
            const document = getter();
            const permissions = [...(document.permissions || [])];
            await bulkSetter({ permissions: [] } as Partial<T>);
            alt.emit('rebar:permissions:clear', entity, permissions, target);
        },
        list: permissionsList,
        has: (permission: string): boolean => {
            const permissions = permissionsList();
            return permissions.includes(permission);
        },
        hasAll: (permissions: string[]): boolean => {
            const permissionsToCheck = permissionsList();

            for (const permission of permissions) {
                if (permissionsToCheck.indexOf(permission) === -1) return false;
            }
            return true;
        },
        hasAnyOf: (permissions: string[]): boolean => {
            const permissionsToCheck = permissionsList();

            for (const permission in permissions) {
                if (permissionsToCheck.indexOf(permission) !== -1) return true;
            }
            return false;
        },
    };

    const groups = {
        add: async (groupName: string): Promise<boolean> => {
            const document = getter();
            if (!document.groups) document.groups = [];
            else if (document.groups.includes(groupName)) return false;
            document.groups.push(groupName);
            await bulkSetter({ groups: document.groups } as Partial<T>);
            alt.emit('rebar:permissions:group:add', entity, groupName, target);
            return true;
        },
        remove: async (groupName: string): Promise<boolean> => {
            const document = getter();
            if (!document.groups || !document.groups.includes(groupName)) return false;
            document.groups = document.groups.filter((group) => group !== groupName);
            await bulkSetter({ groups: document.groups } as Partial<T>);
            alt.emit('rebar:permissions:group:remove', entity, groupName, target);
            return true;
        },
        clear: async (): Promise<void> => {
            const document = getter();
            const groups = document.groups || [];
            await bulkSetter({ groups: [] } as Partial<T>);
            alt.emit('rebar:permissions:group:clear', entity, groups, target);
        },
        list: (): string[] => {
            const document = getter();
            return document.groups || [];
        },
        memberOf: (groupName: string): boolean => {
            const document = getter();
            return document.groups?.includes(groupName) || false;
        },
    };

    return { permissions, groups };
}
