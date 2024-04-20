# Getters - World

A world getter gives information about the in-game world.

```ts
import { useWorldGetter } from '@Server/getters/world.js';

const getter = useWorldGetter();

// Check if an entity is in ocean water
const isInWater = getter.isInOceanWater(somePlayerOrVehicle);

// Check if a position is completely clear
const isClear = getter.positionIsClear(new alt.Vector3(0, 0, 0), 'all');
```
