import * as alt from 'alt-server';
import { useCharacter } from '../document/character.js';
import { useRebar } from '../index.js';

const Rebar = useRebar();

export function useWeapon(player: alt.Player) {
    /**
     * Give and appy weapons to a player
     *
     * @param {(alt.IWeapon & { ammo: number })[])} weapons
     * @param {{ [hash: string]: number }} ammoData
     */
    function apply(weapons: (alt.IWeapon & { ammo: number })[]) {
        const lastWeapon = player.currentWeapon;

        player.removeAllWeapons();

        for (let weapon of weapons) {
            player.giveWeapon(weapon.hash, weapon.ammo, lastWeapon === weapon.hash);
            player.setWeaponTintIndex(weapon.hash, weapon.tintIndex);
            for (let component of weapon.components) {
                player.addWeaponComponent(weapon.hash, component);
            }
        }
    }

    /**
     * Clear all weapons and ammo
     *
     * @return
     */
    async function clear() {
        player.removeAllWeapons();

        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        await document.setBulk({
            weapons: [],
            ammo: {},
        });

        sync();
    }

    /**
     * Clear and remove all ammo for a specific weapon
     *
     * @param {string} model
     * @return
     */
    async function clearWeapon(model: string) {
        const weaponHash = alt.hash(model);
        const document = Rebar.document.character.useCharacter(player);
        player.removeWeapon(weaponHash);
        if (!document.get()) {
            return;
        }

        const weapons = document.getField('weapons') ?? [];
        const index = weapons.findIndex((x) => x.hash === weaponHash);
        if (index >= 0) {
            weapons.splice(index, 1);
        }

        await document.set('weapons', weapons);
        sync();
    }

    /**
     * Get all weapons that the character has currently
     *
     * @return
     */
    function getWeapons() {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return [];
        }

        const weapons = document.getField('weapons') ?? [];
        return weapons;
    }

    /**
     * Add a weapon to the player
     *
     * @param {string} model
     * @param {number} ammo
     * @return
     */
    async function add(model: string, ammoCount: number) {
        const document = Rebar.document.character.useCharacter(player);
        player.giveWeapon(model, ammoCount, true);
        if (!document.get()) {
            return;
        }

        const weapons = document.getField('weapons') ?? [];

        weapons.push({ components: [], hash: alt.hash(model), tintIndex: 0, ammo: ammoCount });

        await document.set('weapons', weapons);
        sync();
    }

    /**
     * Add ammo for the current given weapon, and save to the database
     *
     * @param {string} model
     * @param {number} ammoCount
     * @return
     */
    async function addAmmo(model: string, ammoCount: number) {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return false;
        }

        const modelHash = alt.hash(model);
        const weapons = document.getField('weapons') ?? [];

        const index = weapons.findIndex((x) => x.hash === modelHash);
        if (index <= -1) {
            return false;
        }

        weapons[index].ammo += ammoCount;
        player.setWeaponAmmo(model, weapons[index].ammo);
        document.set('weapons', weapons);
        return true;
    }

    /**
     * Save current player weapons
     */
    function save() {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        const weapons = document.getField('weapons');
        if (!weapons || weapons.length <= 0) {
            return;
        }

        for (let weapon of player.weapons) {
            const index = weapons.findIndex((x) => x.hash === weapon.hash);
            if (index <= -1) {
                continue;
            }

            const { ammoTypeHash } = alt.getWeaponModelInfoByHash(weapon.hash);
            weapons[index].ammo = player.getAmmo(ammoTypeHash);
        }

        document.set('weapons', weapons);
    }

    /**
     * Calls the `save` function
     *
     * @deprecated
     */
    function saveAmmo() {
        save();
    }

    /**
     * Synchronize the weapons the player currently has
     *
     * @return
     */
    function sync() {
        const document = useCharacter(player);
        const data = document.get();
        if (!data || !data.weapons) {
            return;
        }

        apply(data.weapons);
    }

    return {
        add,
        addAmmo,
        apply,
        clear,
        clearWeapon,
        getWeapons,
        save,
        saveAmmo,
        sync,
    };
}
