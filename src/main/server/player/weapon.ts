import * as alt from 'alt-server';
import { useCharacter } from '../document/character.js';
import { useRebar } from '../index.js';

const Rebar = useRebar();

export function useWeapon(player: alt.Player) {
    /**
     * Give and appy weapons to a player
     *
     * @param {alt.IWeapon[]} weapons
     * @param {{ [hash: string]: number }} ammoData
     */
    function apply(weapons: alt.IWeapon[], ammoData: { [hash: string]: number }) {
        const lastWeapon = player.currentWeapon;

        player.removeAllWeapons();

        for (let weapon of weapons) {
            const ammo = ammoData[weapon.hash] ?? 0;
            player.giveWeapon(weapon.hash, ammo, lastWeapon === weapon.hash);
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
        const ammo = document.getField('ammo') ?? {};

        const index = weapons.findIndex((x) => x.hash === weaponHash);
        if (index >= 0) {
            weapons.splice(index, 1);
        }

        if (ammo[weaponHash]) {
            delete ammo[weaponHash];
        }

        await document.setBulk({
            weapons,
            ammo,
        });

        sync();
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
        const ammo = document.getField('ammo') ?? {};

        weapons.push({ components: [], hash: alt.hash(model), tintIndex: 0 });
        ammo[alt.hash(model)] = ammoCount;

        await document.setBulk({
            weapons,
            ammo,
        });

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
            return;
        }

        const ammo = document.getField('ammo') ?? {};
        if (ammo[alt.hash(model)]) {
            ammo[alt.hash(model)] += ammoCount;
        } else {
            ammo[alt.hash(model)] = ammoCount;
        }

        player.setWeaponAmmo(model, ammo[alt.hash(model)]);
        document.set('ammo', ammo);
    }

    /**
     * Add a component to the specified weapon and save to the database
     *
     * @param {string} model
     * @param {string} component
     * @return
     */
    async function addWeaponComponent(model: number, component: number) {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        const weaponHash = model;
        const weapons = document.getField('weapons') ?? [];

        const weaponIndex = weapons.findIndex((w) => w.hash === weaponHash);
        if (weaponIndex === -1) {
            return;
        }

        const updatedWeapons = [...weapons];
        const weapon = { ...updatedWeapons[weaponIndex] };

        if (!weapon.components.includes(component)) {
            weapon.components = [...weapon.components, component];
        }

        updatedWeapons[weaponIndex] = weapon;

        player.addWeaponComponent(weaponHash, component);

        await document.set('weapons', updatedWeapons);
    }

    /**
     * Remove a component from the specified weapon and save to the database
     *
     * @param {string} model
     * @param {string} component
     * @return
     */
    async function removeWeaponComponent(model: number, component: number) {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        const weaponHash = model;
        const weapons = document.getField('weapons') ?? [];

        const weaponIndex = weapons.findIndex((w) => w.hash === weaponHash);
        if (weaponIndex === -1) {
            return;
        }

        const updatedWeapons = [...weapons];
        const weapon = { ...updatedWeapons[weaponIndex] };

        const componentIndex = weapon.components.indexOf(component);
        if (componentIndex !== -1) {
            weapon.components = [
                ...weapon.components.slice(0, componentIndex),
                ...weapon.components.slice(componentIndex + 1),
            ];
        }

        updatedWeapons[weaponIndex] = weapon;

        player.removeWeaponComponent(weaponHash, component);

        await document.set('weapons', updatedWeapons);
    }

    /**
     * Save current player weapons
     */
    function save() {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        const ammo: { [key: string]: number } = {};
        for (let weapon of player.weapons) {
            ammo[weapon.hash] = player.getAmmo(weapon.hash);
        }

        document.setBulk({
            weapons: player.weapons,
            ammo: ammo,
        });
    }

    function saveAmmo() {
        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            return;
        }

        const ammo: { [key: string]: number } = {};
        for (let weapon of player.weapons) {
            ammo[weapon.hash] = player.getAmmo(weapon.hash);
        }

        document.set('ammo', ammo);
    }

    function sync() {
        const document = useCharacter(player);
        const data = document.get();
        if (!data || !data.weapons) {
            return;
        }

        apply(data.weapons, data.ammo);
    }

    return {
        add,
        addAmmo,
        addWeaponComponent,
        removeWeaponComponent,
        apply,
        clear,
        clearWeapon,
        save,
        saveAmmo,
        sync,
    };
}
