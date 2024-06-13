import * as alt from 'alt-server';
import * as Utility from '../utility/index.js';
import { Account } from '@Shared/types/account.js';
import { KnownKeys } from '@Shared/utilityTypes/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { Character } from '@Shared/types/character.js';
import { usePermission } from '@Server/systems/permission.js';
import { useRebar } from '../index.js';

const Rebar = useRebar();
const sessionKey = 'document:account';
const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const db = useDatabase();

export function useAccount(player: alt.Player) {
    /**
     * Check if the player currently has an account bound to them
     */
    function isValid() {
        if (!player.hasMeta(sessionKey)) {
            return false;
        }

        if (!player.getMeta(sessionKey)) {
            return false;
        }

        return true;
    }

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
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, CollectionNames.Accounts);

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
        await db.update({ _id: data._id, ...fields }, CollectionNames.Accounts);

        Object.keys(fields).forEach((key) => {
            if (typeof callbacks[key] === 'undefined') {
                return;
            }

            for (let cb of callbacks[key]) {
                cb(player, data[key], oldValues[key]);
            }
        });
    }

    /**
     * Return all characters that belong to this account
     *
     * @template T
     * @return {(Promise<(Character & T)[]>)}
     */
    async function getCharacters<T = {}>(): Promise<(Character & T)[]> {
        const data = player.getMeta(sessionKey) as Account & T;
        const results = await db.getMany({ account_id: data._id }, CollectionNames.Characters);
        return results as (Character & T)[];
    }

    /**
     * Add a permission to the given player's account.
     *
     * @export
     * @param {alt.Player} player
     * @param {string} permission
     * @return {*}
     */
    async function addPermission(permission: string) {
        if (!player.valid) {
            return false;
        }

        const perm = usePermission(player);
        return await perm.add('account', permission);
    }

    /**
     * Remove a permission to the given player's account.
     *
     * @export
     * @param {string} permission
     * @return {*}
     */
    async function removePermission(permission: string) {
        if (!player.valid) {
            return false;
        }

        const perm = usePermission(player);
        return await perm.remove('account', permission);
    }

    /**
     * Check if the player has an account permission.
     *
     * @export
     * @param {string} permission
     * @return {boolean}
     */
    function hasPermission(permission: string) {
        const perm = usePermission(player);
        return perm.has('account', permission);
    }

    /**
     * Set the password for this account
     *
     * @param {string} plainText
     */
    async function setPassword(plainText: string) {
        await set('password', Utility.hash(plainText));
    }

    /**
     * Ban an account with a reason, and kick them from the server.
     *
     * @param {string} reason
     */
    async function setBanned(reason: string) {
        await setBulk({ reason, banned: true });
        if (player && player.valid) {
            player.kick(reason);
        }
    }

    /**
     * Check a provided password for this account
     *
     * @param {string} plainText
     * @return
     */
    function checkPassword(plainText: string) {
        const data = get();
        if (!data) {
            return false;
        }

        return Utility.check(plainText, data.password);
    }

    const permission = {
        addPermission,
        removePermission,
        hasPermission,
        setBanned,
    };

    return {
        addPermission,
        get,
        getCharacters,
        getField,
        isValid,
        permission,
        set,
        setBulk,
        setPassword,
        checkPassword,
    };
}

export function useAccountBinder(player: alt.Player) {
    /**
     * Binds a player identifier to a Account document.
     * This document is cleared on disconnected automatically.
     * This should be the first thing you do after having a user authenticate.
     *
     * @param {Account & T} document
     */
    function bind<T = {}>(document: Account & T): ReturnType<typeof useAccount> | undefined {
        if (!player.valid) {
            return undefined;
        }

        player.setMeta(sessionKey, document);
        Rebar.events.useEvents().invoke('account-bound', player, document);
        return useAccount(player);
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
