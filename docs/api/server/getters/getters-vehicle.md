# Vehicle

The vehicle getter gives single vehicle information.

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useVehicleGetter();

// Get a vehicle by database id
const someVehicle = getter.byDatabaseID('_id');

// Get a vehicle by alt:V identifier
const someVehicle2 = getter.byID(5);

// Get closest vehicle to a player, that isn't the vehicle the player is driving
const someVehicle3 = getter.closestVehicle(somePlayer);

// Get the driver of a vehicle
const someDriver = getter.driver(someVehicle);

// Get vehicle in front of a vehicle
const someVehicle4 = getter.inFrontOf(someVehicle);

// Check if a vehicle is near a position
const isNearPosition = getter.isNearPosition(someVehicle, new alt.Vector3(0, 0, 0), 5);

// Check if a vehicle model is valid
const isValidModel = getter.isValidModel(alt.hash('infernus'));

// Get the passengers of a vehicle
const passengers = getter.passengers(someVehicle);
```
