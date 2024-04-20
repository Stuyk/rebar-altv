# Getters - Player

A player getter helps you find a player based on various information.

```ts
import { usePlayerGetter } from '@Server/getters/player.js';

const getter = usePlayerGetter();

// Returns a account by account _id
const somePlayer = getter.byAccount('_id');

// Returns a player by character _id
const somePlayer2 = getter.byCharacter('_id');

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
