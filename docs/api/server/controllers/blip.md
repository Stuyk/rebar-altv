# Blip

Create a map marker that displays an icon, and text on the map.

!!!
These are general purpose blips, if you need more robust functionality use the blip directly.
!!!

![](../../../static/controllers/blip.png)

## Global Markers

A global blip can be seen by all players.

```ts
import { useRebar } from '@Server/index.js';
import { BlipColor } from '@Shared/types/blip.js';

const Rebar = useRebar();

// Create a global blip
const blip = Rebar.controllers.useBlipGlobal({
    pos: SpawnPos,
    color: BlipColor.BLUE,
    sprite: 57,
    shortRange: true,
    text: 'Spawn',
});

// Update the blip
blip.update({ pos: new alt.Vector3(0, 0, 0), text: 'New Text!' });

// Destroy the blip
blip.destroy();
```

Additionally, you can attach a blip to any entity like a player, or a vehicle like this.

```ts
const blip = Rebar.controllers.useBlipGlobal({
    color: 6,
    pos: player.pos,
    shortRange: true,
    sprite: 128,
    text: `${player.name}`,
});

blip.attach(player);
```

## Local Markers

A local blip can only been seen by a single player.

```ts
import { useRebar } from '@Server/index.js';
import { BlipColor } from '@Shared/types/blip.js';

const Rebar = useRebar();

// Create the blip locally
const blip = Rebar.controllers.useBlipLocal(player, {
    pos: SpawnPos,
    color: BlipColor.BLUE,
    sprite: 57,
    shortRange: true,
    text: 'Spawn',
});

// Update the blip
blip.update({ pos: new alt.Vector3(0, 0, 0), text: 'New Text!' });

// Destroy the blip
blip.destroy();
```
