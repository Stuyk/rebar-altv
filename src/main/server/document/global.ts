import { useDatabase } from '@Server/database/index.js';
import { CollectionNames } from './shared.js';

const db = useDatabase();
const data: { [key: string]: { [key: string]: any } } = {};

export async function useGlobal<T extends Object = Object>(identifier: string) {
    if (!data[identifier]) {
        let newData = await db.get<{ _id: string; identifier: string }>({ identifier }, CollectionNames.Global);

        if (!newData) {
            const _id = await db.create({ identifier }, CollectionNames.Global);
            newData = await db.get<{ _id: string; identifier: string }>({ _id }, CollectionNames.Global);
        }

        data[identifier] = newData;
    }

    /**
     * Returns the entire document, use type casting or generics to define what is returned
     *
     * @template T
     * @return {T}
     */
    function get(): T {
        return data[identifier] as T;
    }

    /**
     * Returns a specific field from the document, with generic type cast support
     *
     * @template T
     * @param {string} fieldName
     * @return {T}
     */
    function getField<K extends keyof T>(fieldName: K): T[K] {
        const refData = data[identifier] as T;
        return refData[fieldName];
    }

    /**
     * Set any field name or value in your global document
     *
     * @param {string} fieldName
     * @param {*} value
     * @return {Promise<boolean>}
     */
    async function set<K extends keyof T>(fieldName: K, value: T[K]): Promise<boolean> {
        data[identifier] = Object.assign(data[identifier], { [fieldName]: value });
        return await db.update({ _id: data[identifier]._id, [fieldName]: value }, CollectionNames.Global);
    }

    /**
     * Set multiple fields in your global document
     *
     * @param {Partial<T>} data
     * @return {Promise<boolean>}
     */
    async function setBulk(newData: Partial<T>): Promise<boolean> {
        data[identifier] = Object.assign(data[identifier], newData);
        return await db.update({ _id: data[identifier]._id, ...newData }, CollectionNames.Global);
    }

    return {
        get,
        getField,
        set,
        setBulk,
    };
}
