# useVehicle

Used to create a new vehicle document, repair vehicles, apply vehicle documents, etc.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const vehicle = new alt.Vehicle('infernus', alt.Vector3.zero, alt.Vector3.zero);
const rVehicle = Rebar.vehicle.useVehicle(vehicle);

// Used to apply mods, health, etc. to a vehicle if it has a document bound
rVehicle.sync();

// Use a document template to any given vehicle, does not save data
rVehicle.apply({ pos: new alt.Vector3(0, 0, 0) });

// Save all current damage, position, rotation etc.
// This does not create a new document for the given vehicle
rVehicle.save();

// Correctly repairs the vehicle and returns the new vehicle instance
// Players will be removed from the vehicle on repair
await rVehicle.repair();

// Creating a vehicle and assigning it to a character id, or some other identifier
const document = await rVehicle.create(someCharacterIdOrSomethingElse);

// Toggle a door freely, or toggle as a player to check permission for vehicle
rVehicle.toggleDoor(parseInt(id));
rVehicle.toggleDoorAsPlayer(player, 1);

// Toggle engine freely, or toggle as a player to check permission for vehicle
rVehicle.toggleEngine();
rVehicle.toggleEngineAsPlayer(player);

// Toggle lock freely, or toggle as a player to check permission for vehicle
rVehicle.toggleLock();
rVehicle.toggleLockAsPlayer(player);

// Check if a vehicle has a document bound to it
rVehicle.isBound();

// Add player to the vehicle, remove their id, or clear all keys
const didAdd = await rVehicle.keys.add('some_document_id');
const didRemove = await rVehicle.keys.remove('some_document_id');
rVehicle.keys.clear();
```
