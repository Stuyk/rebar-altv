# Chapter 8. Exercises

In the last section we learned all about programming, and got a basic understanding of reading code, and how the VSCode intellisense works. Now in this section we're going to explain a problem, and you're going to try and build a solution. They'll be fairly straight forward exercises but it'll help with understanding the code a bit more.

## Spawn a Vehicle

### Problem

Given the code in the last section, there was a section on creating a vehicle. Spawn a vehicle and then use the `setIntoVehicle` function on the player and pass the vehicle and seat `1` which is the driver seat. You can spawn the vehicle when the player connects to the server.

Here's a few vehicle models: `t20`, `akuma`, `infernus`, `washington`.

### Solution

```ts
const spawnA = new alt.Vector3({
    x: -866.1100463867188,
    y: -172.2382354736328,
    z: 37.80417251586914,
});

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';
    player.spawn(spawnA);

    const vehicle = new alt.Vehicle('akuma', spawnA, new alt.Vector3(0, 0, 0));
    player.setIntoVehicle(vehicle, 1);
});
```

## Flip Between Spawns

### Problem

Given the two positions below and some code, use them to teleport each player who joins the server to a different spawn.

_You can use a `boolean` to switch between both positions._

```ts
const spawnA = new alt.Vector3({
    x: -866.1100463867188,
    y: -172.2382354736328,
    z: 37.80417251586914,
});

const spawnB = new alt.Vector3({
    x: -852.0750122070312,
    y: -141.91029357910156,
    z: 37.64464569091797,
});

let useSpawnA = true;

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';
    player.spawn(spawnA);
});
```

### Solution

You can verify this solution by typing `reconnect` in the `F8` in-game console menu.

```ts
const spawnA = new alt.Vector3({
    x: -866.1100463867188,
    y: -172.2382354736328,
    z: 37.80417251586914,
});

const spawnB = new alt.Vector3({
    x: -852.0750122070312,
    y: -141.91029357910156,
    z: 37.64464569091797,
});

let useSpawnA = false;

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';

    if (useSpawnA) {
        player.spawn(spawnA);
        useSpawnA = false;
    } else {
        player.spawn(spawnB);
        useSpawnA = true;
    }
});
```

## Randomized Weapons

### Problem

You want to randomly give each player a weapon when they connect to the server.

Given the following list of weapons, use it to randomly give a player a weapon.

```ts
const weapons = ['WEAPON_BATTLEAXE', 'WEAPON_CROWBAR', 'WEAPON_BAT'];
```

Additionally, you can generate a random `index` for an array like this.

```ts
const index = Math.floor(Math.random() * weapons.length);
```

Use the index to distribute a weapon to the player.

### Solution

```ts
const spawnA = new alt.Vector3({
    x: -866.1100463867188,
    y: -172.2382354736328,
    z: 37.80417251586914,
});

const weapons = ['WEAPON_BATTLEAXE', 'WEAPON_CROWBAR', 'WEAPON_BAT'];

alt.on('playerConnect', (player) => {
    player.model = 'mp_m_freemode_01';
    player.spawn(spawnA);

    const index = Math.floor(Math.random() * weapons.length);
    player.giveWeapon(weapons[index], 1, true);
});
```
