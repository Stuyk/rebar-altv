import {useDatabase} from '@Server/database/index.js';
import {usePermissionProxy} from "@Server/systems/permissions/index.js";

type BaseDocument = { _id: string };

const db = useDatabase();

export async function useVirtual<T extends BaseDocument = BaseDocument>(_id: string, collectionName: string) {
    let data = await db.get({_id}, collectionName) as T;

    if (typeof data === 'undefined') {
        return undefined
    }

    /**
     * Get the current document data.
     *
     * @return {T}
     */
    function get(): T {
        return data;
    }

    /**
     * Refresh the document from the database.
     */
    async function refresh(): Promise<void> {
        data = await db.get({_id}, collectionName) as T;
    }

    /**
     * Returns a specific key from the document
     *
     * @template K
     * @param {K} fieldName The field to get
     * @return {(Promise<T[K] | undefined>)} The value of the field
     */
    async function getField<K extends keyof T>(fieldName: K): Promise<T[K] | undefined> {
        return data[String(fieldName)];
    }

    /**
     * Set a specific value for the given document and save to database
     *
     * @template K
     * @param {K} fieldName The field to set
     * @param {T[K]} value The value to set
     * @return {Promise<boolean>} Returns true if the operation was successful
     */
    async function set<K extends keyof T>(fieldName: K, value: T[K]): Promise<boolean> {
        if (await db.update({_id, [String(fieldName)]: value}, collectionName)) {
            data[String(fieldName)] = value;
            return true;
        }
        return false;
    }

    /**
     * Set multiple fields for the given document and save to database
     *
     * @param {Partial<T>} fields The fields to update
     * @return {Promise<boolean>} Returns true if the operation was successful
     */
    async function setBulk(fields: Partial<T>): Promise<boolean> {
        if (await db.update({_id, ...fields}, collectionName)) {
            data = {...data, ...fields};
            return true;
        }
        return false;
    }

    const {permissions, groups} = usePermissionProxy(get, setBulk, undefined, undefined);

    const proxyHandler: ProxyHandler<any> = {
        get(target, prop) {
            if (collectionName !== "Account" && collectionName !== "Character") {
                throw new Error(`Access to ${String(prop)} is not allowed for collection ${collectionName}`);
            }
            return target[prop];
        }
    };

    const permissionsProxy = new Proxy(permissions, proxyHandler);
    const groupsProxy = new Proxy(groups, proxyHandler);

    return {refresh, get, getField, set, setBulk, permissions: permissionsProxy, groups: groupsProxy};
}
