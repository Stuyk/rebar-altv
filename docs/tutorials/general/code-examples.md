# Code Examples

This is a giant page for code examples and a general purpose cookbook for writing just about anything.

Always check the documentation for further information and to see the full extent of what this framework has to offer.

!!!
Some of these code examples require other plugins to work.

Check out [Plebmasters Forge](<https://forge.plebmasters.de/hub?targetFrameworks=Rebar+(alt:V)&contentType=Script>) to see all available plugins.
!!!

## Server API

We mostly work on the server-side for a majority of the functionality.

Here's how to import Rebar in various ways.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
```

```ts
import * as alt from 'alt-server';

const Rebar = alt.getMeta('Rebar');
```

## Notifying a Player

Send a default GTA:V notification to the player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

alt.on('playerConnect', (player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification('Welcome to the server!');
});
```

## Screen Shards

Shards are like the `Mission Failed` full screen effect that you see in normal GTA:V. You can show them like this.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

alt.on('playerConnect', (player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showShard({
        title: 'Welcome to the Server',
        duration: 2000,
    });
});
```

## Screen Mission Text

Mission text will show in the bottom center of the screen.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

alt.on('playerConnect', (player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showMissionText('Visit our website at https://rebarv.com');
});
```

## Keybinds

Keybinds can be done on server-side to allow for server-side callbacks.

Here's a simple keybind that when `K` is pressed it teleports the player to a position.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const Keybinder = Rebar.useKeybinder();

const K_KEY = 75;

Keybinder.on(K_KEY, (player) => {
    player.pos = new alt.Vector3({
        x: 912,
        y: -199,
        z: 73,
    });
});
```

## Interaction Points

Interaction points are places where the player can press `E` to do something.

They can be accented with markers, text labels, and blips.

There are also local versions of `marker`, `text label`, and `blips` to only show it to a single player. Which has full control via server-side.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { MarkerType } from '@Shared/types/marker.js';

const Rebar = useRebar();

const posRef = new alt.Vector3({
    x: 912.6202392578125,
    y: -198.6721649169922,
    z: 71.22137451171875,
});

const interaction = Rebar.controllers.useInteraction(
    new alt.ColshapeCylinder(posRef.x, posRef.y, posRef.z, 3, 3),
    'player',
);

interaction.onEnter((player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification('Entered the point!');
});

interaction.onLeave((player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification('Left the point!');
});

interaction.on((player) => {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.notify.showNotification('Pressed E on the Point!');
});

Rebar.controllers.useMarkerGlobal({
    pos: posRef,
    color: new alt.RGBA(0, 255, 0, 75),
    scale: new alt.Vector3(3, 3, 1),
    type: MarkerType.CYLINDER,
});

Rebar.controllers.useTextLabelGlobal({
    pos: posRef.add(0, 0, 1),
    text: 'Press E to do something!',
});

Rebar.controllers.useBlipGlobal({
    color: 6,
    pos: posRef,
    shortRange: true,
    sprite: 128,
    text: 'Interaction Point',
});
```

## Server Configuration

You can modify server configuration by creating a plugin that tweaks the settings.

Here's an example of what you can invoke to change settings in Rebar.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const ServerConfig = Rebar.useServerConfig();

ServerConfig.set('disablePistolWhip', true);
ServerConfig.set('disableVehicleEngineAutoStart', true);
ServerConfig.set('disableVehicleEngineAutoStop', true);
ServerConfig.set('disableVehicleSeatSwap', true);
ServerConfig.set('hideAreaName', true);
ServerConfig.set('hideHealthArmour', true);
ServerConfig.set('hideMinimapInPage', true);
ServerConfig.set('hideMinimapInVehicle', true);
ServerConfig.set('hideMinimapOnFoot', true);
ServerConfig.set('hideStreetName', true);
ServerConfig.set('hideVehicleClass', true);
ServerConfig.set('hideVehicleName', true);
```

## Saving Player Data

With a character select plugin, and auth plugin installed it's really easy to write data to the database using the document system.

This document system also exists for other entities like Vehicles,and Accounts.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

type MyCustomData = {
    mydata: string;
};

async function onSomeEvent(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    await rPlayer.character.setBulk<MyCustomData>({
        mydata: 'hello world!',
    });

    // Returns `hello world`
    const mydata = rPlayer.character.getField<MyCustomData>('mydata');
}
```

## Character & Account Permissions

There's a built in permission system to assign players as admins, specific jobs, etc.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);

    rPlayer.character.permission.addPermission('mechanic');
    rPlayer.account.addPermission('admin');
}
```

## Registering Commands

With a `chat plugin` you can register commands and invoke them in-game in the chat window.

Additionally, you can protect your commands from being ran under `Account Permissions` or `Character Permissions`.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();

Messenger.commands.register({
    name: 'test',
    desc: '- Runs a test command',
    callback: async (player) => {},
});

Messenger.commands.register({
    name: 'adminonlycommand',
    desc: '- Only admins can run this',
    options: { accountPermissions: ['admin'] },
    callback: async (player) => {
        const rPlayer = Rebar.usePlayer(player);
        rPlayer.notify.showNotification('Hello Admin!');
    },
});

Messenger.commands.register({
    name: 'mechaniconlycommand',
    desc: '- Only mechanics can run this',
    options: { permissions: ['mechanic'] },
    callback: async (player) => {
        const rPlayer = Rebar.usePlayer(player);
        rPlayer.notify.showNotification('Hello Mechanic!');
    },
});
```

## Assigning Custom Models

You can easily assign a custom player model to override their default character appearance.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.clothing.setSkin('a_c_husky');
}
```

## Assigning Uniforms

You can also assign and clear uniforms for the player to wear.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    rPlayer.clothing.setUniform([
        { dlc: alt.hash('some_dlc'), drawable: 0, id: 5, texture: 0 },
        { dlc: alt.hash('some_dlc'), drawable: 1, id: 6, texture: 0 },
        { dlc: alt.hash('some_dlc'), drawable: 7, id: 2, texture: 0 },
    ]);

    rPlayer.clothing.clearUniform();
}
```

## Owned Vehicles

Vehicles can be owned by an individual player, or a `permission`.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    const _id = rPlayer.character.getField('_id');

    let veh: alt.Vehicle;
    try {
        veh = new alt.Vehicle('infernus', player.pos, player.rot);
    } catch (err) {
        // invalid vehicle model
        return;
    }

    // Automatically stored into the database
    Rebar.vehicle.useVehicle(veh).create(_id);
}
```

## Spawn Owned Vehicles

Want to easily spawn vehicles owned by a player, well Rebar makes it super simple.

It even handles synchronizing mods, extras, lock state, engine damage, and more.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function someFunction(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    const vehicles = await rPlayer.character.getVehicles();

    for (let vehData of vehicles) {
        if (Rebar.get.useVehicleGetter().isSpawned(vehData._id)) {
            continue;
        }

        const newVehicle = new alt.Vehicle(vehData.model, vehData.pos, vehData.rot);
        const rVehicle = Rebar.vehicle.useVehicle(newVehicle);
        rVehicle.bind(vehData);
    }
}
```

## Teleport to a Waypoint

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const Messenger = Rebar.messenger.useMessenger();

Messenger.commands.register({
    name: '/tpwp',
    desc: 'teleport to a given waypoint',
    callback: async (player: alt.Player) => {
        const pos = await Rebar.player.useWaypoint(player).get();
        if (!pos) {
            return;
        }

        player.pos = pos.add(0, 0, 1);
    },
});
```

## Control Pedestrians

We have a built in pedestrian controller on server-side that lets you invoke natives to easily make pedestrians do various things.

Here's one that makes a bunch of them dance together.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const peds: ReturnType<typeof Rebar.controllers.usePed>[] = [];

    for (let i = 0; i < 10; i++) {
        const ped = Rebar.controllers.usePed(new alt.Ped('mp_m_freemode_01', player.pos, player.rot, 100));
        ped.setOption('makeStupid', true);
        peds.push(ped);

        ped.invoke('taskPlayAnim', 'timetable@tracy@ig_5@idle_a', 'idle_a', 8.0, 8.0, -1, 1, 0, false, false, false);
    }

    for (let ped of peds) {
        ped.invoke('taskPlayAnim', 'timetable@tracy@ig_5@idle_a', 'idle_a', 8.0, 8.0, -1, 1, 0, false, false, false);
    }
}
```

## Raycast for Objects

Raycast for an Object from server-side.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// This may not work for all ATM models, just an example
const models = [
    //
    alt.hash('prop_atm_01'),
    alt.hash('prop_atm_02'),
    alt.hash('prop_atm_03'),
    alt.hash('prop_fleeca_atm'),
];

messenger.commands.register({
    name: '/atm',
    desc: '',
    callback: async (player: alt.Player) => {
        const rPlayer = Rebar.usePlayer(player);
        const result = await rPlayer.raycast.getFocusedObject(true);

        if (!result) {
            return;
        }

        if (!models.includes(result.model)) {
            return;
        }

        rPlayer.notify.showNotification('Interacting with an ATM!');
    },
});
```
