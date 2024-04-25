# Marker

Create a physical in-world marker that can be walked through.

## Global Markers

A global marker can be seen by all players.

```ts
import { useMarkerGlobal } from '@Server/controllers/marker.js';
import { MarkerType } from '../../shared/types/marker.js'; // Import may vary

// Create a global marker
const globalMarker = useMarkerGlobal({
    pos: new alt.Vector3(0, 0, 0),
    color: new alt.RGBA(255, 255, 255, 255),
    dimension: 0,
    scale: new alt.Vector3(1, 1, 1),
    type: MarkerType.CYLINDER,
});

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
import { useMarkerLocal } from '@Server/controllers/marker.js';
import { MarkerType } from '../../shared/types/marker.js'; // Import may vary

// Create the marker
const marker = useMarkerLocal(somePlayer, {
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
