# useVehicle

Used to create a new vehicle document, repair vehicles, apply vehicle documents, etc.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Used to apply mods, health, etc. to a vehicle if it has a document bound
Rebar.vehicle.useVehicle(vehicle).sync();

// Use a document template to any given vehicle, does not save data
Rebar.vehicle.useVehicle(vehicle).apply({ pos: new alt.Vector3(0, 0, 0) });

// Save all current damage, position, rotation etc.
// This does not create a new document for the given vehicle
Rebar.vehicle.useVehicle(vehicle).save();

// Correctly repairs the vehicle and returns the new vehicle instance
// Players will be removed from the vehicle on repair
await Rebar.vehicle.useVehicle(vehicle).repair();

// Creating a vehicle and assigning it to a character id, or some other identifier
const newVehicle = new alt.Vehicle('infernus', alt.Vector3.zero, alt.Vector3.zero);
const document = await Rebar.vehicle.useVehicle(newVehicle).create(someCharacterIdOrSomethingElse);
```
