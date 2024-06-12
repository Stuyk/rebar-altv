import * as alt from 'alt-server';
import * as document from '../document/index.js';
import { Account } from 'main/shared/types/account.js';
import { Character } from 'main/shared/types/character.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames } from '@Server/document/shared.js';

const { getMany } = useDatabase();
const documentType = {
    account: document.useAccount,
    character: document.useCharacter,
    vehicle: document.useVehicle,
};

export type DefaultPerms = 'admin' | 'moderator';
export type SupportedDocuments = 'account' | 'character';

const InternalFunctions = {
    /**
     * Add a permission to a player based on default permissions, or a custom permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     */
    async add<CustomPerms = ''>(
        player: alt.Player,
        perm: DefaultPerms | CustomPerms,
        dataName: SupportedDocuments,
    ): Promise<boolean> {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        if (!data.permissions) {
            data.permissions = [];
        }

        const formattedPerm = String(perm).toLowerCase();
        const index = data.permissions.findIndex((x) => x === formattedPerm);
        if (index >= 0) {
            return false;
        }

        data.permissions.push(formattedPerm);
        await document.set('permissions', data.permissions);
        return true;
    },
    /**
     * Remove a permission from a player based on default permissions, or a custom permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     */
    async remove<CustomPerms = ''>(
        player: alt.Player,
        perm: DefaultPerms | CustomPerms,
        dataName: SupportedDocuments,
    ): Promise<boolean> {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        if (!data.permissions) {
            data.permissions = [];
        }

        const formattedPerm = String(perm).toLowerCase();
        const index = data.permissions.findIndex((x) => x === formattedPerm);
        if (index <= -1) {
            return false;
        }

        data.permissions.splice(index, 1);
        await document.set('permissions', data.permissions);
        return true;
    },
    /**
     * Clear all permissions from a player's account.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @return {void}
     */
    async clear(player: alt.Player, dataName: SupportedDocuments) {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return;
        }

        data.permissions = [];
        await document.set('permissions', data.permissions);
    },
    /**
     * Check if a player has a permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {boolean}
     */
    has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms, dataName: SupportedDocuments): boolean {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        const formattedPerm = String(perm).toLowerCase();
        return data.permissions.findIndex((x) => x === formattedPerm) !== -1;
    },
    /**
     * Check if a player has at least one permission given an Array of permissions.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(Array<DefaultPerms | CustomPerms>)} perm
     * @return {boolean}
     */
    hasOne<CustomPerms = ''>(
        player: alt.Player,
        perms: Array<DefaultPerms | CustomPerms>,
        dataName: SupportedDocuments,
    ): boolean {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        if (perms.length <= 0) {
            return false;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        for (let perm of perms) {
            const index = data.permissions.findIndex((x) => x === perm);
            if (index <= -1) {
                continue;
            }

            return true;
        }

        return false;
    },
    /**
     * Check if a player has all permissions in an array..
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(Array<DefaultPerms | CustomPerms>)} perms
     * @return {boolean}
     */
    hasAll<CustomPerms = ''>(
        player: alt.Player,
        perms: Array<DefaultPerms | CustomPerms>,
        dataName: SupportedDocuments,
    ): boolean {
        if (typeof documentType[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const document = documentType[dataName](player);
        const data = document.get();
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        for (let perm of perms) {
            const index = data.permissions.findIndex((x) => x === perm);
            if (index <= -1) {
                return false;
            }

            continue;
        }

        return true;
    },
};

export function usePermission(player: alt.Player) {
    /**
     * Add a permission to an account or character.
     *
     *
     * @template CustomPerms
     * @param {('character' | 'account')} type
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {Promise<boolean>}
     */
    async function add<CustomPerms = ''>(
        type: 'character' | 'account',
        perm: DefaultPerms | CustomPerms,
    ): Promise<boolean> {
        return await InternalFunctions.add(player, perm, type);
    }

    /**
     * Remove a permission from an account or character.
     *
     *
     * @template CustomPerms
     * @param {('character' | 'account')} type
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {Promise<boolean>}
     */
    async function remove<CustomPerms = ''>(
        type: 'character' | 'account',
        perm: DefaultPerms | CustomPerms,
    ): Promise<boolean> {
        return await InternalFunctions.remove(player, perm, type);
    }

    /**
     * Clear all permissions for an account or character.
     *
     *
     * @param {('character' | 'account')} type
     * @return {Promise<void>}
     */
    async function clear(type: 'character' | 'account') {
        return await InternalFunctions.clear(player, type);
    }

    /**
     * Check if a character or account has a single permission.
     *
     *
     * @template CustomPerms
     * @param {('character' | 'account')} type
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {boolean}
     */
    function has<CustomPerms = ''>(type: 'character' | 'account', perm: DefaultPerms | CustomPerms): boolean {
        return InternalFunctions.has(player, perm, type);
    }

    /**
     * Check if a character or account has a atleast one permission.
     *
     *
     * @template CustomPerms
     * @param {('character' | 'account')} type
     * @param {(Array<DefaultPerms | CustomPerms>)} perms
     * @return {boolean}
     */
    function hasOne<CustomPerms = ''>(
        type: 'character' | 'account',
        perms: Array<DefaultPerms | CustomPerms>,
    ): boolean {
        return InternalFunctions.hasOne(player, perms, type);
    }

    /**
     * Check if a character or account has all the permissions.
     *
     * @template CustomPerms
     * @param {('character' | 'account')} type
     * @param {(Array<DefaultPerms | CustomPerms>)} perms
     * @return {boolean}
     */
    function hasAll<CustomPerms = ''>(
        type: 'character' | 'account',
        perms: Array<DefaultPerms | CustomPerms>,
    ): boolean {
        return InternalFunctions.hasAll(player, perms, type);
    }

    return {
        add,
        clear,
        has,
        hasOne,
        hasAll,
        remove,
    };
}

/**
 * Get all documents that have a specified permission in their permissions array.
 * Will return an empty array if no permissions are found.
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {(Array<DefaultPerms | CustomPerms>)} perms
 */
export async function getAll<CustomPerms = ''>(
    type: 'character' | 'account',
    perm: DefaultPerms | CustomPerms,
): Promise<Array<Account> | Array<Character>> {
    const collectionName = type === 'character' ? CollectionNames.Characters : CollectionNames.Accounts;
    const results = await getMany<Character | Account>({ permissions: [String(perm)] }, collectionName);
    return type === 'character' ? (results as Character[]) : (results as Account[]);
}

export function getPermissions(entity: alt.Player, type: 'character' | 'account');
export function getPermissions(entity: alt.Vehicle, type: 'vehicle');
/**
 * Get permissions for a given entity and type
 *
 * @param {alt.Entity} entity
 * @param {('account' | 'character' | 'vehicle')} type
 * @return {Array<string>}
 */
export function getPermissions(entity: alt.Entity, type: 'account' | 'character' | 'vehicle'): Array<string> {
    let data;
    switch (type) {
        case 'account':
            const accountDocument = documentType.account(entity as alt.Player);
            data = accountDocument.get();
            return data.permissions ? data.permissions : [];
        case 'character':
            const characterDocument = documentType.character(entity as alt.Player);
            data = characterDocument.get();
            return data.permissions ? data.permissions : [];
        case 'vehicle':
            const vehicleDocument = documentType.vehicle(entity as alt.Vehicle);
            data = vehicleDocument.get();
            return data.permissions ? data.permissions : [];
        default:
            return [];
    }
}
