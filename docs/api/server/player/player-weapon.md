# Weapon

Used to synchronize or apply weapons to a player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const playerWeapons = Rebar.player.useWeapon(somePlayer);

// Use character document for weapons
playerWeapons.sync();

// Save weapons & ammo
await playerWeapons.save();

// Save just ammo
await playerWeapons.saveAmmo();

// Add a weapon, and save to the database, and re-apply weapons
await playerWeapons.add('WEAPON_MINIGUN', 100);

// Add ammo for specific gun
await playerWeapons.addAmmo('WEAPON_MINIGUN', 100);

// Clear all weapons & ammo
await playerWeapons.clear();

// Remove a weapon and all ammo for the weapon
await playerWeapons.clearWeapon('WEAPON_MINIGUN');

// Override and apply weapons to a player
const weapons = [
    { hash: alt.hash('WEAPON_MINIGUN'), components: [], tintIndex: 0 },
    { hash: alt.hash('WEAPON_RPG'), components: [], tintIndex: 0 },
];
const ammo = {
    [alt.hash('WEAPON_MINIGUN')]: 999,
    [alt.hash('WEAPON_RPG')]: 5,
};

playerWeapons.apply(weapons, ammo);
```
