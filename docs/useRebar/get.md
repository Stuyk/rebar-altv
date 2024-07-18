---
order: 650
---

# get

Get means that it's going to `get` some information about a player, players, a vehicle, vehicles, or the world

They're general purpose utility functions for getting information.

## usePlayerGetter

The player getter gets information about a single player.

### Usage

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.usePlayerGetter();
const result = getter.byAccount('_id');
```

### Examples

```ts
// Returns a account by account _id, or id
const somePlayer = getter.byAccount('_id');
const somePlayer2 = getter.byAccount(5);

// Returns a player by character _id, or id
const somePlayer2 = getter.byCharacter('_id');
const somePlayer2 = getter.byCharacter(5);

// Returns a player by full name
const somePlayer3 = getter.byName('john_doe');

// Returns a player by partial name
const somePlayer4 = getter.byPartialName('john');

// Returns the closest player to a player
const somePlayer5 = getter.closestToPlayer(somePlayer);

// Returns the closest player to a vehicle
const somePlayer6 = getter.closestToVehicle(someVehicle);

// Returns a player in front of the player, if present
const somePlayer7 = getter.inFrontOf(somePlayer, 5); // Returns a player in front of the player, if present

// Returns true if player is near a position
const result1 = getter.isNearPosition(somePlayer, new alt.Vector3(0, 0, 0));

// Returns true if the player is logged in and playing on a character
const result2 = getter.isValid(somePlayer);
```

## usePlayersGetter

The players getter gets information about all players.

### Usage

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.usePlayersGetter();
const results = getter.driving();
```

### Examples

```ts
// Returns an array of players who are driving
const playersDriving = getter.driving();

// Returns an array of players in range of a position
const playersInRange = getter.inRange(new alt.Vector3(0, 0, 0), 5);

// Returns an array with players who are close, and the distance they are from the position
const playersInRangeWithDist = getter.inRangeWithDistance(new alt.Vector3(0, 0, 0), 5);

// Returns all players in a vehicle
const playersInVehicle = getter.inVehicle(someVehicle);

// Returns all players who are currently using a character, and playing
const playersOnline = getter.online();

// Returns all players who are currently using a character, playing, and have a weapon out
const playersOnlineWithWeapon = getter.onlineWithWeapons();

// Returns all players who are currently walking around
const playersWalking = getter.walking();

// Returns all players who have a certain name
const playersWithName = getter.withName('john_doe');
```

## useVehicleGetter

The vehicle getter gets information about a single vehicle.

### Usage

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useVehicleGetter();
```

### Examples

```ts
// Get a vehicle by database id
const someVehicle = getter.byId('_id');
const someVehicle = getter.byId(5);

// Get a vehicle by alt:V identifier
const someVehicle2 = getter.byAltvId(5);

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

## useVehiclesGetter

The vehicles getter gives information about all vehicles.

### Usage

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useVehiclesGetter();
const results = getter.inRange(new alt.Vector3(0, 0, 0), 5);
```

### Examples

```ts
// Get all vehicles in range of a position
const vehiclesInRange = getter.inRange(new alt.Vector3(0, 0, 0), 5);
```

## useWorldGetter

A world getter gives information about the in-game world.

### Usage

```ts
import { useRebar } from '@Server/index.js';
const Rebar = useRebar();

const getter = Rebar.get.useWorldGetter();
```

### Examples

```ts
// Check if an entity is in ocean water
const isInWater = getter.isInOceanWater(somePlayerOrVehicle);

// Check if a position is completely clear
const isClear = await getter.positionIsClear(new alt.Vector3(0, 0, 0), 'all');
```
