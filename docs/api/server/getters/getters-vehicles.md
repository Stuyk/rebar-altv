# Vehicles

The vehicles getter gives information about all vehicles.

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useVehiclesGetter();

// Get all vehicles in range of a position
const vehiclesInRange = getter.inRange(new alt.Vector3(0, 0, 0), 5);
```
