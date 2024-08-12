import * as alt from 'alt-server';
import { Character, Vehicle } from '@Shared/types/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { usePermissionProxy } from '@Server/systems/permissions/permissionProxy.js';
import { useIncrementalId } from './increment.js';
import { usePlayerAppearance } from '../player/appearance.js';
import { useClothing } from '../player/clothing.js';
import { useWeapon } from '../player/weapon.js';
import { useState } from '../player/state.js';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerCharacterBound': (player: alt.Player, document: Character) => void;
        'rebar:playerCharacterUpdated': <K extends keyof Character>(
            player: alt.Player,
            fieldName: K,
            value: Character[K],
        ) => void;
    }
}

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
     * @return {(Character | undefined)}
     */
    function get(): Character | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return <Character>player.getMeta(sessionKey);
    }

    /**
     * Get the current value of a specific field inside of the player data object.
     * Can be extended to obtain any value easily.
     *
     * @template K
     * @param {K} fieldName
     * @return {(Character[K] | undefined)}
     */
    function getField<K extends keyof Character>(fieldName: K): Character[K] | undefined {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        return player.getMeta(sessionKey)[String(fieldName)];
    }

    /**
     * Sets a player document value, and saves it automatically to the selected Character database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template K
     * @param {K} fieldName
     * @param {Character[K]} value
     * @return
     */
    async function set<K extends keyof Character>(fieldName: K, value: Character[K]) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        const typeSafeFieldName = String(fieldName);
        let data = player.getMeta(sessionKey) as Character;
        let oldValue = undefined;

        if (data[typeSafeFieldName]) {
            oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
        }

        const newData = { [typeSafeFieldName]: value };

        data = Object.assign(data, newData);
        player.setMeta(sessionKey, data);
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, CollectionNames.Characters);

        alt.emit('rebar:playerCharacterUpdated', player, fieldName, value);

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
     * @param {Partial<Character>} fields
     * @return
     */
    async function setBulk(fields: Partial<Character>) {
        if (!player.hasMeta(sessionKey)) {
            return undefined;
        }

        let data = player.getMeta(sessionKey) as Character;

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
            alt.emit('rebar:playerCharacterUpdated', player, key as keyof Character, data[key]);

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
     * @return {Promise<Vehicle[]>}
     */
    async function getVehicles(): Promise<Vehicle[]> {
        const data = player.getMeta(sessionKey) as Vehicle;
        const results = await db.getMany({ owner: data._id }, CollectionNames.Vehicles);
        return results as Vehicle[];
    }

    async function addIdentifier() {
        if (typeof getField('id') !== 'undefined') {
            return getField('id');
        }

        const identifier = useIncrementalId(CollectionNames.Characters);
        const id = await identifier.getNext();
        await setBulk({ id });
        return id;
    }

    const { permissions, groups } = usePermissionProxy<Character>(get, setBulk, player, 'character');

    return {
        permissions,
        groups,
        addIdentifier,
        get,
        getField,
        isValid,
        getVehicles,
        set,
        setBulk,
    };
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
        alt.emit('rebar:playerCharacterBound', player, document);

        if (syncPlayer) {
            usePlayerAppearance(player).sync();
            useClothing(player).sync();
            useWeapon(player).sync();
            useState(player).sync();
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
