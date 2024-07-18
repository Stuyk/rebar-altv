import { useDatabase } from '@Server/database/index.js';

type BaseDocument = { _id: string };

const db = useDatabase();

export function useVirtual<T extends BaseDocument = BaseDocument>(_id: string, collectionName: string) {
    /**
     * Return the entire document from the database
     *
     * @return {(Promise<T | undefined>)}
     */
    async function get(): Promise<T | undefined> {
        const data = await db.get({ _id }, collectionName);
        return data as BaseDocument & T;
    }

    /**
     * Returns a specific key from the document
     *
     * @template K
     * @param {K} fieldName
     * @return {(Promise<T[K] | undefined>)}
     */
    async function getField<K extends keyof T>(fieldName: K): Promise<T[K] | undefined> {
        const data = await get();
        return data[String(fieldName)];
    }

    /**
     * Set a specific value for the given document and save to database
     *
     * @template K
     * @param {K} fieldName
     * @param {T[K]} value
     */
    async function set<K extends keyof T>(fieldName: K, value: T[K]) {
        await db.update({ _id, [String(fieldName)]: value }, collectionName);
    }

    /**
     * Set multiple fields for the given document and save to database
     *
     * @param {Partial<T>} fields
     */
    async function setBulk(fields: Partial<T>) {
        await db.update({ _id, ...fields }, collectionName);
    }

    return { get, getField, set, setBulk };
}
