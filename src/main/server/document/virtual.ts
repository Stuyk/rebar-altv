import { KnownKeys } from '@Shared/utilityTypes/index.js';
import { useDatabase } from '@Server/database/index.js';

type BaseDocument = { _id: string };

const db = useDatabase();

export function useVirtual(_id: string, collectionName: string) {
    /**
     * Return data from the database directly.
     *
     * @template T
     * @return {(Promise<(BaseDocument & T) | undefined>)}
     */
    async function get<T = {}>(): Promise<(BaseDocument & T) | undefined> {
        const data = await db.get({ _id }, collectionName);
        return data as BaseDocument & T;
    }

    /**
     * Return specific fiedl data from the document
     *
     * @template T
     * @template ReturnType
     * @param {(keyof KnownKeys<BaseDocument & T>)} fieldName
     * @return {(Promise<ReturnType | undefined>)}
     */
    async function getField<T = {}, ReturnType = any>(
        fieldName: keyof KnownKeys<BaseDocument & T>,
    ): Promise<ReturnType | undefined> {
        const data = await get<BaseDocument & T>();
        return data[String(fieldName)];
    }

    /**
     * Set a specified field to a specified value
     *
     * @template T
     * @template Keys
     * @param {Keys} fieldName
     * @param {*} value
     */
    async function set<T = {}, Keys = keyof KnownKeys<BaseDocument & T>>(fieldName: Keys, value: any) {
        await db.update({ _id, [String(fieldName)]: value }, collectionName);
    }

    /**
     * Set many fields to specified values
     *
     * @template T
     * @template Keys
     * @param {Keys} fields
     */
    async function setBulk<T = {}, Keys = Partial<BaseDocument & T>>(fields: Keys) {
        await db.update({ _id, ...fields }, collectionName);
    }

    return { get, getField, set, setBulk };
}
