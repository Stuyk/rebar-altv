import * as alt from 'alt-server';
import * as Utility from '../utility/index.js';
import { Character, Account } from '@Shared/types/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { usePermissionProxy } from '@Server/systems/permissions/permissionProxy.js';
import { useIncrementalId } from './increment.js';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerAccountBound': (player: alt.Player, document: Account) => void;
        'rebar:playerAccountUpdated': <K extends keyof Account>(
            player: alt.Player,
            fieldName: K,
            value: Account[K],
        ) => void;
    }
}

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
     * @return {(Account | undefined)}
     */
    function get(): Account | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return <Account>player.getMeta(sessionKey);
    }

    /**
     * Get the current value of a specific field inside of the player data object.
     * Can be extended to obtain any value easily.
     *
     * @template K
     * @param {K} fieldName
     * @return {(Account[K] | undefined)}
     */
    function getField<K extends keyof Account>(fieldName: K): Account[K] | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return player.getMeta(sessionKey)[String(fieldName)];
    }

    /**
     * Sets a player document value, and saves it automatically to the selected account database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template K
     * @param {K} fieldName
     * @param {Account[K]} value
     * @return
     */
    async function set<K extends keyof Account>(fieldName: K, value: Account[K]) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        const typeSafeFieldName = String(fieldName);
        let data = player.getMeta(sessionKey) as Account;
        let oldValue = undefined;

        if (data[typeSafeFieldName]) {
            oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
        }

        const newData = { [typeSafeFieldName]: value };

        data = Object.assign(data, newData);
        player.setMeta(sessionKey, data);
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, CollectionNames.Accounts);

        alt.emit('rebar:playerAccountUpdated', player, fieldName, value);

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
     * @param {Partial<Account>} fields
     * @return
     */
    async function setBulk(fields: Partial<Account>) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        let data = player.getMeta(sessionKey) as Account;

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
            alt.emit('rebar:playerAccountUpdated', player, key as keyof Account, data[key]);

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
     * @return {Promise<Character[]>}
     */
    async function getCharacters(): Promise<Character[]> {
        const data = player.getMeta(sessionKey) as Character;
        const results = await db.getMany({ account_id: data._id }, CollectionNames.Characters);
        return results as Character[];
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

    async function addIdentifier() {
        if (typeof getField('id') !== 'undefined') {
            return getField('id');
        }

        const identifier = await useIncrementalId(CollectionNames.Accounts);
        const id = await identifier.getNext();
        await setBulk({ id });
        return id;
    }

    const { permissions, groups } = usePermissionProxy<Account>(get, setBulk, player, 'account');

    return {
        permissions,
        groups,
        addIdentifier,
        get,
        getCharacters,
        getField,
        isValid,
        set,
        setBulk,
        setPassword,
        checkPassword,
        setBanned,
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
        alt.emit('rebar:playerAccountBound', player, document);

        const accountUse = useAccount(player);
        try {
            accountUse.addIdentifier();
        } catch (err) {}

        return accountUse;
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
