# Marker

Create a physical in-world marker that can be walked through.

## Global Markers

A global marker can be seen by all players.

```ts
import { useRebar } from '@Server/index.js';
import { MarkerType } from '@Shared/types/marker.js';

const Rebar = useRebar();

// Create a global marker
// you can specify streaming distance from 1 to 50, it will reset to 50 if not specified or if it is greater than 50.
const globalMarker = Rebar.controllers.useMarkerGlobal(
    {
        pos: new alt.Vector3(0, 0, 0),
        color: new alt.RGBA(255, 255, 255, 255),
        dimension: 0,
        scale: new alt.Vector3(1, 1, 1),
        type: MarkerType.CYLINDER,
    },
    20, // streaming distance, completely optional
);

// Change the position of the marker
globalMarker.update({ pos: new alt.Vector3(0, 0, 1) });

// Get marker data
const marker = globalMarker.getMarker();

// Get virtual entity
const virtualEntity = globalMarker.getEntity();

// Remove the marker
globalMarker.destroy();
```

## Local Markers

A local marker can only be seen by a single player.

```ts
import { useRebar } from '@Server/index.js';
import { MarkerType } from '@Shared/types/marker.js';

const Rebar = useRebar();

// Create the marker
const marker = Rebar.controllers.useMarkerLocal(somePlayer, {
    pos: new alt.Vector3(0, 0, 0),
    color: new alt.RGBA(255, 255, 255, 255),
    dimension: 0,
    scale: new alt.Vector3(1, 1, 1),
    type: MarkerType.CYLINDER,
});

// Update the marker for the player
marker.update({ pos: new alt.Vector3(0, 0, 1) });

// Destroy the marker
marker.destroy();
```
