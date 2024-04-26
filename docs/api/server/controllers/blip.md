# Blip

Create a map marker that displays an icon, and text on the map.

!!!
These are general purpose blips, if you need more robust functionality use the blip directly.
!!!

## Global Markers

A global blip can be seen by all players.

```ts
import { useBlipGlobal } from '@Server/controllers/blip.js';
import { BlipColor } from '../../../main/shared/types/blip.js';

// Create a global blip
const blip = useBlipGlobal(player, {
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

## Local Markers

A local blip can only been seen by a single player.

```ts
import { useBlipLocal } from '@Server/controllers/blip.js';
import { BlipColor } from '../../../main/shared/types/blip.js';

// Create the blip locally
const blip = useBlipLocal(player, {
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
