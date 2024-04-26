import * as alt from 'alt-server';
import { Character } from '../../shared/types/character.js';
import { KnownKeys } from '../../shared/utilityTypes/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { Vehicle } from 'main/shared/types/vehicle.js';
import { usePermission } from '@Server/systems/permission.js';
import { usePermissionGroup } from '@Server/systems/permissionGroup.js';

const sessionKey = 'document:character';
const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const db = useDatabase();

export function useCharacter(player: alt.Player) {
    /**
     * Return current player data and their associated character object.
     *
     * @template T
     * @return {(T & Character) | undefined}
     */
    function get<T = {}>(): (T & Character) | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return <T & Character>player.getMeta(sessionKey);
    }

    /**
     * Get the current value of a specific field inside of the player data object.
     * Can be extended to obtain any value easily.
     *
     * @template T
     * @param {(keyof KnownKeys<Character & T>)} fieldName
     * @return {ReturnType | undefined}
     */
    function getField<T = {}, ReturnType = any>(fieldName: keyof KnownKeys<Character & T>): ReturnType | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return player.getMeta(sessionKey)[String(fieldName)];
    }

    /**
     * Sets a player document value, and saves it automatically to the selected Character database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(keyof KnownKeys<Character & T>)} fieldName
     * @param {*} value
     * @return {void}
     */
    async function set<T = {}, Keys = keyof KnownKeys<Character & T>>(fieldName: Keys, value: any) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        const typeSafeFieldName = String(fieldName);
        let data = player.getMeta(sessionKey) as T & Character;
        let oldValue = undefined;

        if (data[typeSafeFieldName]) {
            oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
        }

        const newData = { [typeSafeFieldName]: value };

        data = Object.assign(data, newData);
        player.setMeta(sessionKey, data);
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, CollectionNames.Characters);

        if (typeof callbacks[typeSafeFieldName] === 'undefined') {
            return;
        }

        for (let cb of callbacks[typeSafeFieldName]) {
            cb(player, value, oldValue);
        }
    }

    /**
     * Sets player document values, and saves it automatically to the selected Character's database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(Partial<Character & T>)} fields
     * @returns {void}
     */
    async function setBulk<T = {}, Keys = Partial<Character & T>>(fields: Keys) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        let data = player.getMeta(sessionKey) as Character & T;

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
        await db.update({ _id: data._id, ...fields }, CollectionNames.Characters);

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
     * Return all vehicles that belong to this account
     *
     * @template T
     * @return {(Promise<(Vehicle & T)[]>)}
     */
    async function getVehicles<T = {}>(): Promise<(Vehicle & T)[]> {
        const data = player.getMeta(sessionKey) as Vehicle & T;
        const results = await db.getMany({ owner: data._id }, CollectionNames.Vehicles);
        return results as (Vehicle & T)[];
    }

    /**
     * Adds a permission to this character
     *
     * @async
     * @name addPermission
     * @param {string} permission
     * @returns {Promise<boolean>}
     * @exports
     */
    async function addPermission(permission: string) {
        if (!player.valid) {
            return false;
        }

        const perm = usePermission(player);
        return await perm.add('character', permission);
    }

    /**
     * Removes a permission from the given player character.
     *
     * @async
     * @name removePermission
     * @param {string} permission
     * @returns {Promise<boolean>}
     * @exports
     */
    async function removePermission(permission: string) {
        if (!player.valid) {
            return false;
        }

        const perm = usePermission(player);
        return await perm.remove('character', permission);
    }

    /**
     * Check if the current player character has a permission.
     *
     * @export
     * @param {string} permission
     * @return {boolean}
     */
    function hasPermission(permission: string) {
        if (!player.valid) {
            return false;
        }

        const perm = usePermission(player);
        return perm.has('character', permission);
    }

    /**
     * Check if a player character has a group permission.
     *
     * @export
     * @param {string} groupName
     * @param {string} permission
     * @returns {boolean}
     */
    function hasGroupPermission(groupName: string, permission: string) {
        const data = get();
        if (typeof data === 'undefined') {
            return false;
        }

        const perm = usePermissionGroup(player);
        return perm.hasGroupPerm(groupName, permission);
    }

    /**
     * Check if a player has any matching permission
     *
     * @export
     * @param {PermissionGroup} document
     * @param {string} groupName
     * @param {string} permission
     */
    function hasAnyGroupPermission(groupName: string, permissions: string[]) {
        const data = get();
        if (typeof data === 'undefined') {
            return false;
        }

        const perm = usePermissionGroup(data);
        return perm.hasAtLeastOneGroupPerm(groupName, permissions);
    }

    /**
     * Add a group permission to a character.
     *
     * @export
     * @param {string} groupName
     * @param {string} permission
     * @return {Promise<boolean>}
     */
    async function addGroupPerm(groupName: string, permission: string): Promise<boolean> {
        const data = get();
        if (typeof data === 'undefined') {
            return false;
        }

        const perm = usePermissionGroup(data);
        const newDocument = perm.addGroupPerm(groupName, permission);
        await set('groups', newDocument.groups);
        return true;
    }

    /**
     * Remove a group permission from a character.
     *
     * @export
     * @param {string} groupName
     * @param {string} permission
     * @return {Promise<boolean>}
     */
    async function removeGroupPerm(groupName: string, permission: string): Promise<boolean> {
        const data = get();
        if (typeof data === 'undefined') {
            return false;
        }

        const perm = usePermissionGroup(data);
        const newDocument = perm.removeGroupPerm(groupName, permission);
        await set('groups', newDocument.groups);
        return true;
    }

    const permission = {
        addPermission,
        addGroupPerm,
        removePermission,
        removeGroupPerm,
        hasAnyGroupPermission,
        hasPermission,
        hasGroupPermission,
    };

    return { get, getField, getVehicles, permission, set, setBulk };
}

export function useCharacterBinder(player: alt.Player) {
    /**
     * Binds a player identifier to a Character document.
     * This document is cleared on disconnected automatically.
     * This should be the first thing you do after having a user authenticate.
     *
     * @param {Character & T} document
     */
    function bind<T = {}>(document: Character & T): ReturnType<typeof useCharacter> | undefined {
        if (!player.valid) {
            return undefined;
        }

        player.setMeta(sessionKey, document);
        return useCharacter(player);
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

export function useCharacterEvents() {
    /**
     * Listen for individual player document changes.
     *
     * @param {string} fieldName
     * @param {KeyChangeCallback} callback
     * @return {void}
     */
    function on<T = {}>(fieldName: keyof KnownKeys<Character & T>, callback: KeyChangeCallback) {
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
