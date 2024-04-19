import * as alt from 'alt-server';
import { Account } from '../../shared/types/account.js';
import { KnownKeys } from '../../shared/utilityTypes/index.js';
import { useDatabase } from '@Server/database/index.js';

export type KeyChangeCallback = (player: alt.Player, newValue: any, oldValue: any) => void;

const DatabaseName = 'Accounts';
const sessionKey = 'document:account';
const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const db = useDatabase();

export function useAccount(player: alt.Player) {
    /**
     * Return current player data and their associated account object.
     *
     * @template T
     * @return {(T & Account) | undefined}
     */
    function get<T = {}>(): (T & Account) | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return <T & Account>player.getMeta(sessionKey);
    }

    /**
     * Get the current value of a specific field inside of the player data object.
     * Can be extended to obtain any value easily.
     *
     * @template T
     * @param {(keyof KnownKeys<Account & T>)} fieldName
     * @return {ReturnType | undefined}
     */
    function getField<T = {}, ReturnType = any>(fieldName: keyof KnownKeys<Account & T>): ReturnType | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return player.getMeta(sessionKey)[String(fieldName)];
    }

    /**
     * Sets a player document value, and saves it automatically to the selected account database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(keyof KnownKeys<Character & T>)} fieldName
     * @param {*} value
     * @return {void}
     */
    async function set<T = {}, Keys = keyof KnownKeys<Account & T>>(fieldName: Keys, value: any) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        const typeSafeFieldName = String(fieldName);
        let data = player.getMeta(sessionKey) as T & Account;
        let oldValue = undefined;

        if (data[typeSafeFieldName]) {
            oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
        }

        const newData = { [typeSafeFieldName]: value };

        data = Object.assign(data, newData);
        player.setMeta(sessionKey, data);
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, DatabaseName);

        if (typeof callbacks[typeSafeFieldName] === 'undefined') {
            return;
        }

        for (let cb of callbacks[typeSafeFieldName]) {
            cb(player, value, oldValue);
        }
    }

    /**
     * Sets player document values, and saves it automatically to the selected Account's database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(Partial<Account & T>)} fields
     * @returns {void}
     */
    async function setBulk<T = {}, Keys = Partial<Account & T>>(fields: Keys) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        let data = player.getMeta(sessionKey) as Account & T;

        const oldValues = {};

        Object.keys(fields).forEach((key) => {
            if (typeof data[key] === 'undefined') {
                oldValues[key] = undefined;
                return;
            }

            oldValues[key] = JSON.parse(JSON.stringify(data[key]));
        });

        data = Object.assign(data, fields);
        player.setMeta(sessionKey, data);
        await db.update({ _id: data._id, ...fields }, DatabaseName);

        Object.keys(fields).forEach((key) => {
            if (typeof callbacks[key] === 'undefined') {
                return;
            }

            for (let cb of callbacks[key]) {
                cb(player, data[key], oldValues[key]);
            }
        });
    }

    return { get, getField, set, setBulk };
}

export function useAccountBinder(player: alt.Player) {
    /**
     * Binds a player identifier to a Account document.
     * This document is cleared on disconnected automatically.
     * This should be the first thing you do after having a user authenticate.
     *
     * @param {Account & T} document
     */
    function bind<T = {}>(document: Account & T) {
        if (!player.valid) {
            return;
        }

        player.setMeta(sessionKey, document);
    }

    /**
     * Unbind a document from a specific player
     */
    function unbind() {
        if (!player.valid) {
            return;
        }

        player.deleteMeta(sessionKey);
    }

    return {
        bind,
        unbind,
    };
}

export function useAccountEvents() {
    /**
     * Listen for individual player document changes.
     *
     * @param {string} fieldName
     * @param {KeyChangeCallback} callback
     * @return {void}
     */
    function on<T = {}>(fieldName: keyof KnownKeys<Account & T>, callback: KeyChangeCallback) {
        const actualFieldName = String(fieldName);

        if (typeof callbacks[actualFieldName] === 'undefined') {
            callbacks[actualFieldName] = [callback];
        } else {
            callbacks[actualFieldName].push(callback);
        }
    }

    return {
        on,
    };
}
