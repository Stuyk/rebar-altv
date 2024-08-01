import {usePlainPermission, type PlainPermissionOptions} from "@Server/systems/permissions/plainPermissions.js";
import {usePermissionGroup} from "@Server/systems/permissions/groupPermissions.js";
import {PermissionsDocumentMixin, GroupsDocumentMixin} from "@Shared/types/index.js";
import {objectData} from "@Shared/utility/clone.js";

type Document = PermissionsDocumentMixin & GroupsDocumentMixin;
type DocumentGetter<T extends Document> = () => T | undefined;
type DocumentBulkSetter<T extends Document> = (fields: Partial<T>) => Promise<void>;

export function usePermissionProxy<T extends Document>(
    getter: DocumentGetter<T>,
    bulkSetter: DocumentBulkSetter<T>
) {
    const permissionsList = (): string[] => {
        const document = getter();

        const documentPermissions = document.permissions || [];
        const groupPermissions = usePermissionGroup().groupsToPlainPermissions(document.groups || []);
        return [...new Set([...documentPermissions, ...groupPermissions])];
    }

    const permissions = {
        grant: async (permission: string, options: PlainPermissionOptions = undefined): Promise<boolean> => {
            const document = getter();
            const [granted, values] = usePlainPermission<T>(document).grant(permission, options);
            if (!granted) return false;
            await bulkSetter(values as Partial<T>);
            return granted;
        },
        revoke: async (permission: string): Promise<boolean> => {
            const document = getter();
            const [revoked, values] = usePlainPermission<T>(document).revoke(permission);
            if (!revoked) return false;
            await bulkSetter(values as Partial<T>);
            return revoked;
        },
        clear: async (): Promise<void> => {
            return await bulkSetter({permissions: [], permissionsMeta: {}} as Partial<T>);
        },
        list: permissionsList,
        has: (permission: string): boolean => {
            const document = getter();
            const hasPlainPermission = usePlainPermission(document).check(permission);
            if (hasPlainPermission) return true;
            if (!document.groups) return false;
            for (const group of document.groups) {
                if (usePermissionGroup().groupHasPermission(group, permission)) return true;
            }
            return false;
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
        removeExpiredPermissions: async (): Promise<void> => {
            const document = getter();
            const expiredPermissions = usePlainPermission(document).getExpired();
            if (expiredPermissions.length === 0) return;
            const newPermissions = document.permissions.filter((permission) => !expiredPermissions.includes(permission));
            const newPermissionsMeta = objectData(document.permissionsMeta);
            for (const permission of expiredPermissions) {
                delete newPermissionsMeta[permission];
            }
            await bulkSetter({permissions: newPermissions, permissionsMeta: newPermissionsMeta} as Partial<T>);
        }
    };

    const groups = {
        add: async (groupName: string): Promise<boolean> => {
            const document = getter();
            if (!document.groups) document.groups = [];
            else if (document.groups.includes(groupName)) return false;
            document.groups.push(groupName);
            await bulkSetter({groups: document.groups} as Partial<T>);
            return true;
        },
        remove: async (groupName: string): Promise<boolean> => {
            const document = getter();
            if (!document.groups || !document.groups.includes(groupName)) return false;
            document.groups = document.groups.filter((group) => group !== groupName);
            await bulkSetter({groups: document.groups} as Partial<T>);
            return true;
        },
        set: async (groupNames: string[]): Promise<void> => {
            return await bulkSetter({groups: groupNames} as Partial<T>);
        },
        clear: async (): Promise<void> => {
            return await bulkSetter({groups: []} as Partial<T>);
        },
        memberOf: (groupName: string): boolean => {
            const document = getter();
            return document.groups?.includes(groupName) || false;
        },
    }

    return {permissions, groups};
}
