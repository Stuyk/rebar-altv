import * as alt from 'alt-server';
import { Character } from '@Shared/types/character.js';
import { KnownKeys } from '@Shared/utilityTypes/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { Vehicle } from 'main/shared/types/vehicle.js';
import { useRebar } from '../index.js';
import { usePermissionProxy } from '@Server/systems/permissionProxy.js';
import { removeGroup } from 'natives';

const Rebar = useRebar();
const sessionKey = 'document:character';
const callbacks: { [key: string]: Array<KeyChangeCallback> } = {};
const db = useDatabase();

export function useCharacter(player: alt.Player) {
    /**
     * Check if the player currently has a character bound to them
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
    function getField<T = {}, K extends keyof KnownKeys<Character & T> = keyof KnownKeys<Character & T>>(
        fieldName: K,
    ): (Character & T)[K] | undefined {
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

    async function addIdentifier() {
        if (typeof getField('id') !== 'undefined') {
            return getField('id');
        }

        const identifier = Rebar.database.useIncrementalId(Rebar.database.CollectionNames.Characters);
        const id = await identifier.getNext();
        await setBulk({ id });
        return id;
    }

    const { permissions, groupPermissions } = usePermissionProxy(player, 'character', get, set);

    /**
     * Old permission system. Will be deprecated in the future.
     * Use the new permission system instead.
     * @deprecated
     */
    const permission = {
        /**
         * @deprecated
         */
        addPermission: async (permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.addPermission. This will be deprecated.');
            return await permissions.addPermission(permissionName);
        },
        /**
         * @deprecated
         */
        removePermission: async (permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.removePermission. This will be deprecated.');
            return await permissions.removePermission(permissionName);
        },
        /**
         * @deprecated
         */
        hasPermission: (permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.hasPermission. This will be deprecated.');
            return permissions.hasPermission(permissionName);
        },
        /**
         * @deprecated
         */
        hasGroupPermission: (groupName: string, permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.hasGroupPermission. This will be deprecated.');
            return groupPermissions.hasGroupPerm(groupName, permissionName);
        },
        /**
         * @deprecated
         */
        hasAnyGroupPermission: (groupName: string, permissionNames: string[]) => {
            alt.logWarning('Consider using useCharacter(...).permissions.hasAnyGroupPermission. This will be deprecated.');
            return groupPermissions.hasAtLeastOneGroupPerm(groupName, permissionNames);
        },
        /**
         * @deprecated
         */
        addGroupPerm: async (groupName: string, permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.addGroupPerm. This will be deprecated.');
            return await groupPermissions.addPermissions(groupName, [permissionName]);
        },
        /**
         * @deprecated
         */
        removeGroupPerm: async (groupName: string, permissionName: string) => {
            alt.logWarning('Consider using useCharacter(...).permissions.removeGroupPerm. This will be deprecated.');
            return await groupPermissions.removePermissions(groupName, [permissionName]);
        }
    }

    return { addIdentifier, get, getField, isValid, getVehicles, permission, permissions, groupPermissions, set, setBulk };
}

export function useCharacterBinder(player: alt.Player, syncPlayer = true) {
    /**
     * Binds a player identifier to a Character document.
     * This document is cleared on disconnected automatically.
     * This should be the first thing you do after having a user authenticate.
     *
     * Pass `syncPlayer` as false to prevent synchronization of appearance and clothes on binding.
     *
     * @param {Character & T} document
     * @param {boolean} syncPlayer
     */
    function bind<T = {}>(document: Character & T): ReturnType<typeof useCharacter> | undefined {
        if (!player.valid) {
            return undefined;
        }

        player.setMeta(sessionKey, document);
        Rebar.events.useEvents().invoke('character-bound', player, document);

        if (syncPlayer) {
            Rebar.player.usePlayerAppearance(player).sync();
            Rebar.player.useClothing(player).sync();
            Rebar.player.useWeapon(player).sync();
            Rebar.player.useState(player).sync();
        }

        const characterUse = useCharacter(player);
        try {
            characterUse.addIdentifier();
        } catch (err) {}

        return characterUse;
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
