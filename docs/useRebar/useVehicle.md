---
order: 450
---

# useVehicle

Used to create a new vehicle document, repair vehicles, apply vehicle documents, etc.

## useVehicle

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const rVehicle = Rebar.vehicle.useVehicle(new alt.Vehicle('infernus', alt.Vector3.zero, alt.Vector3.zero));
```

### apply

Use a vehicle document, and apply it to the given vehicle.

This does not save the document, but only applies what is in the document.

```ts
rVehicle.apply({ pos: new alt.Vector3(0, 0, 0) });
```

### create

Creates a vehicle document and assigns the owner as the given `identifier`.

Usually you want to pass the character `_id` for this.

```ts
const document = await rVehicle.create(someCharacterIdOrSomethingElse);
```

### handling.set

A way to modify client-side vehicle handling for individual vehicles from server-side.

Any player that enters a vehicle will always get the correct handling data for the individual vehicle.

```ts
rVehicle.handling.set({ brakeForce: 1.0 });
```

#### Valid Handlers

Check out [https://gtacars.net/gta5/glossary](for more information) on these properties.

```ts
interface HandlingData {
    acceleration: number;
    antiRollBarBiasFront: number;
    antiRollBarBiasRear: number;
    antiRollBarForce: number;
    brakeBiasFront: number;
    brakeBiasRear: number;
    brakeForce: number;
    camberStiffnesss: number;
    centreOfMassOffset: shared.Vector3;
    clutchChangeRateScaleDownShift: number;
    clutchChangeRateScaleUpShift: number;
    collisionDamageMult: number;
    damageFlags: number;
    deformationDamageMult: number;
    downforceModifier: number;
    driveBiasFront: number;
    driveInertia: number;
    driveMaxFlatVel: number;
    engineDamageMult: number;
    handBrakeForce: number;
    handlingFlags: number;
    inertiaMultiplier: shared.Vector3;
    initialDragCoeff: number;
    initialDriveForce: number;
    initialDriveGears: number;
    initialDriveMaxFlatVel: number;
    lowSpeedTractionLossMult: number;
    mass: number;
    modelFlags: number;
    monetaryValue: number;
    oilVolume: number;
    percentSubmerged: number;
    percentSubmergedRatio: number;
    petrolTankVolume: number;
    rollCentreHeightFront: number;
    rollCentreHeightRear: number;
    seatOffsetDistX: number;
    seatOffsetDistY: number;
    seatOffsetDistZ: number;
    steeringLock: number;
    steeringLockRatio: number;
    suspensionBiasFront: number;
    suspensionBiasRear: number;
    suspensionCompDamp: number;
    suspensionForce: number;
    suspensionLowerLimit: number;
    suspensionRaise: number;
    suspensionReboundDamp: number;
    suspensionUpperLimit: number;
    tractionBiasFront: number;
    tractionBiasRear: number;
    tractionCurveLateral: number;
    tractionCurveLateralRatio: number;
    tractionCurveMax: number;
    tractionCurveMaxRatio: number;
    tractionCurveMin: number;
    tractionCurveMinRatio: number;
    tractionLossMult: number;
    tractionSpringDeltaMax: number;
    tractionSpringDeltaMaxRatio: number;
    unkFloat1: number;
    unkFloat2: number;
    unkFloat4: number;
    unkFloat5: number;
    weaponDamageMult: number;
}
```

### isBound

Check if a vehicle has a document bound to it

```ts
if (rVehicle.isBound()) {
    // No Document!
    return;
}
```

### keys.add

Add keys to the vehicle for a given user.

```ts
const didAdd = await rVehicle.keys.add('some_document_id');
```

### keys.clear

Remove all keys from the vehicle.

```ts
await rVehicle.keys.clear();
```

### keys.remove

Remove a specific key from the vehicle

```ts
const didRemove = await rVehicle.keys.remove('some_document_id');
```

### repair

Correctly repairs the vehicle and returns the new vehicle instance

Players will be removed from the vehicle on repair

```ts
await rVehicle.repair();
```

### save

Save all current damage, position, rotation etc.

This does not create a new document for the given vehicle

```ts
rVehicle.save();
```

### setRpm

Set the RPM for the vehicle driver to 0

```ts
rVehicle.setRpm(0);
```

### sync

Used to apply mods, health, etc. to a vehicle if it has a document bound

```ts
rVehicle.sync();
```

### toggleDoor

Toggle a door without permission checking.

```ts
rVehicle.toggleDoor(parseInt(id));
```

### toggleDoorAsPlayer

Toggle a door as a player and check permission for vehicle.

```ts
rVehicle.toggleDoorAsPlayer(player, 1);
```

### toggleEngine

Toggle the engine without permission checking.

```ts
rVehicle.toggleEngine();
```

### toggleEngineAsPlayer

Toggle the engine as a player and check permission for vehicle.

```ts
rVehicle.toggleEngineAsPlayer(player);
```

### toggleLock

Toggle the lock without permission checking.

```ts
rVehicle.toggleLock();
```

### toggleLockAsPlayer

Toggle the lock as a player and check permission for vehicle.

```ts
rVehicle.toggleLockAsPlayer(player);
```
