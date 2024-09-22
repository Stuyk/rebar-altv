import * as alt from 'alt-server';
import {MongoClient, Db, InsertOneResult, ObjectId, AggregateOptions, UpdateFilter} from 'mongodb';
import * as Utility from '@Shared/utility/index.js';
import {CollectionNames} from '../document/shared.js';
import {useConfig} from '@Server/config/index.js';

const config = useConfig();

let isConnected = false;
let isInit = false;
let database: Db;
let client: MongoClient;

alt.on('rebar:rpcRestart', () => {
    if (!client) {
        return;
    }

    alt.log(`RPC - Stopping MongoDB Connection`);
    client.close(true);
});

export function useDatabase() {
    async function init(connectionString: string): Promise<boolean> {
        if (isInit) {
            return true;
        }

        isInit = true;

        client = await MongoClient.connect(connectionString).catch((err) => {
            console.warn(`Could not connect to MongoDB instance. Incorrect credentials? Service not running?`, err);
            return undefined;
        });

        if (!client) {
            isInit = false;
            return false;
        }

        database = client.db(config.getField('database_name'));
        isInit = false;
        isConnected = true;
        alt.log('Connected to MongoDB Successfully');

        const promises: Promise<any>[] = [];

        promises.push(createCollection(CollectionNames.Accounts));
        promises.push(createCollection(CollectionNames.Characters));
        promises.push(createCollection(CollectionNames.Global));
        promises.push(createCollection(CollectionNames.Vehicles));

        await Promise.all(promises);
        return true;
    }

    async function getClient() {
        await alt.Utils.waitFor(() => isConnected, 60000);
        return database;
    }

    /**
     * Simply creates a document, and returns its `_id`.
     *
     * @export
     * @template T
     * @param {T} data
     * @param {string} collection
     * @return {(Promise<string | undefined>)}
     */
    async function create<T extends { [key: string]: any }>(data: T, collection: string): Promise<string | undefined> {
        const client = await getClient();
        let result: InsertOneResult<Document>;

        try {
            result = await client.collection(collection).insertOne(data);
            return String(result.insertedId);
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Create a collection if it does not exist
     *
     * @param {string} name
     */
    async function createCollection(name: string) {
        const client = await getClient();
        const collections = await client.listCollections().toArray();
        const index = collections.findIndex((x) => x.name === name);
        if (index >= 0) {
            return;
        }

        try {
            await client.createCollection(name);
        } catch (err) {
        }
    }

    /**
     * Updates a single document by `_id`.
     *
     * Pass any data you want as `update<{ myInterface: string, _id: string }>(..., ...)`
     *
     * @export
     * @template T
     * @param {T} data
     * @param {string} collection
     * @return {Promise<boolean>}
     */
    async function update<T extends { [key: string]: any }>(data: T, collection: string): Promise<boolean> {
        if (!data._id) {
            throw new Error(`Failed to specify _id in update function.`);
        }

        const client = await getClient();
        const dataClone = Utility.clone.objectData<T>(data);
        delete dataClone._id;

        try {
            const result = await client
                .collection(collection)
                .findOneAndUpdate({_id: ObjectId.createFromHexString(data._id)}, {$set: dataClone});
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Update many documents by a filter.
     *
     * @export
     * @template T
     * @param {T} filter
     * @param {UpdateFilter<any>} update
     * @param {string} collection
     */
    async function updateMany<T extends { [key: string]: any }>(filter: T, update: UpdateFilter<T>, collection: string): Promise<boolean> {
        const client = await getClient();
        try {
            const result = await client.collection(collection).updateMany(filter, update);
            return result.acknowledged;
        } catch (err) {
            return false;
        }
    }

    /**
     * Unset fields in a document by `_id` and `collection`.
     *
     * Returns `true` if successful.
     *
     * @param {string} _id Document _id
     * @param {string[]} fields Fields to unset
     * @param {string} collection Collection name
     */
    async function unset(_id: string, fields: string[], collection: string) {
        const client = await getClient();

        try {
            const result = await client.collection(collection).updateOne({_id: ObjectId.createFromHexString(_id)}, {"$unset": Object.assign({}, ...fields.map((x) => ({[x]: ''})))});
            return result.acknowledged
        } catch (err) {
            return false;
        }
    }

    /**
     * Destroy a document by `_id` and `collection`.
     *
     * Returns `true` if successful.
     *
     * @export
     * @param {string} _id
     * @param {string} collection
     * @return {Promise<boolean>}
     */
    async function destroy(_id: string, collection: string): Promise<boolean> {
        const client = await getClient();

        try {
            const result = await client.collection(collection).deleteOne({_id: ObjectId.createFromHexString(_id)});
            return result.deletedCount >= 1;
        } catch (err) {
            return false;
        }
    }

    /**
     * Returns a single document by partial data match.
     *
     * Use `_id` to lookup a document by `_id`. Ensure it is a `string`.
     *
     * Returns `undefined` if a document is not found.
     *
     * @export
     * @template T
     * @param {(Partial<T & { _id: string }>)} dataToMatch
     * @param {string} collection
     * @return {(Promise<T | undefined>)}
     */
    async function get<T extends { [key: string]: any; _id?: string }>(
        dataToMatch: Partial<T>,
        collection: string,
    ): Promise<T | undefined> {
        const client = await getClient();

        try {
            const dataLookup: any = {...dataToMatch};

            if (dataToMatch._id) {
                dataLookup._id = ObjectId.createFromHexString(dataToMatch._id);
            }

            const document = await client.collection(collection).findOne<T>(dataLookup);
            if (!document) {
                return undefined;
            }

            return {...document, _id: String(document._id)};
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    /**
     * Returns all matching documents as `an array` given an object.
     *
     * @export
     * @template T
     * @param {T} dataToMatch
     * @param {string} collection
     * @return {Promise<T[]>}
     */
    async function getMany<T extends { [key: string]: any }>(
        dataToMatch: Partial<T>,
        collection: string,
    ): Promise<T[]> {
        const client = await getClient();

        try {
            const dataLookup: any = {...dataToMatch};

            if (dataToMatch._id) {
                dataLookup._id = ObjectId.createFromHexString(dataToMatch._id);
            }

            const cursor = await client.collection(collection).find<T>(dataLookup);
            const documents = await cursor.toArray();
            return documents.map((x) => {
                return {...x, _id: String(x._id)};
            });
        } catch (err) {
            return [];
        }
    }

    /**
     * Returns all data from a collection if it exists.
     *
     * If the collection does not exist it will return `undefined`
     *
     * @export
     * @template T
     * @param {string} collection
     * @return {(Promise<(T & { _id: string })[] | undefined>)}
     */
    async function getAll<T extends { _id: string }>(collection: string): Promise<(T & { _id: string })[] | undefined> {
        const client = await getClient();

        try {
            const cursor = await client.collection(collection).find();
            const documents = await cursor.toArray();
            return documents.map((x) => {
                return {...x, _id: String(x._id)};
            }) as (T & { _id: string })[];
        } catch (err) {
            return undefined;
        }
    }

    /**
     * Deletes a single document by `_id`
     *
     * If the document was deleted it will return `true`.
     *
     * @export
     * @param {string} _id
     * @param {string} collection
     * @return {Promise<boolean>}
     */
    async function deleteDocument(_id: string, collection: string): Promise<boolean> {
        const client = await getClient();

        try {
            const result = await client.collection(collection).deleteOne({_id: ObjectId.createFromHexString(_id)});
            return result.acknowledged;
        } catch (err) {
            return false;
        }
    }

    /**
     * Runs an aggregation query
     *
     * If the collection does not exist it will return `undefined`
     *
     * @export
     * @param {string} collection
     * @param {any[]} pipeline
     * @param {AggregateOptions} options
     * @return {Promise<T[] | undefined>}
     */
    async function aggregate<T extends { _id: string }>(
        collection: string,
        pipeline: any[],
        options?: AggregateOptions,
    ): Promise<T[] | undefined> {
        const client = await getClient();

        try {
            const cursor = await client.collection(collection).aggregate(pipeline, options);
            const documents = await cursor.toArray();
            return documents.map((x) => {
                return {...x, _id: String(x._id)};
            }) as (T & { _id: string })[];
        } catch (err) {
            return undefined;
        }
    }

    return {
        create,
        createCollection,
        deleteDocument,
        destroy,
        get,
        getAll,
        getClient,
        getMany,
        init,
        isConnected() {
            return isConnected;
        },
        updateMany,
        update,
        aggregate,
        unset,
    };
}
