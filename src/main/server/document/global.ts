import { useDatabase } from '@Server/database/index.js';
import { CollectionNames } from './shared.js';

const db = useDatabase();
const data: { [key: string]: { [key: string]: any } } = {};

export async function useGlobal(identifier: string) {
    if (!data[identifier]) {
        let pulledData = await db.get<{ _id: string; identifier: string }>({ identifier }, CollectionNames.Global);

        if (!pulledData) {
            const _id = await db.create({ identifier }, CollectionNames.Global);
            pulledData = await db.get<{ _id: string; identifier: string }>({ _id }, CollectionNames.Global);
        }

        data[identifier] = pulledData;
    }

    function get<T = Object>(): T {
        return data[identifier] as T;
    }

    function getField<T = any>(fieldName: string): T {
        console.log(data[identifier]);
        return data[identifier][fieldName];
    }

    async function set(fieldName: string, value: any): Promise<boolean> {
        data[identifier][fieldName] = value;
        return await db.update({ _id: data[identifier]._id, [fieldName]: value }, CollectionNames.Global);
    }

    async function setBulk<T = Object>(newData: Partial<T>): Promise<boolean> {
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
