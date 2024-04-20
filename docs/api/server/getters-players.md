# Getters - Players

The players getter gives information about all players.

```ts
import { usePlayersGetter } from '@Server/getters/players.js';

const getter = usePlayersGetter();

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
