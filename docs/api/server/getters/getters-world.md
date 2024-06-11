# World

A world getter gives information about the in-game world.

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useWorldGetter();

// Check if an entity is in ocean water
const isInWater = getter.isInOceanWater(somePlayerOrVehicle);

// Check if a position is completely clear
const isClear = await getter.positionIsClear(new alt.Vector3(0, 0, 0), 'all');
```
