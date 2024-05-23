# Player State

Used to synchronize or apply weapons to a player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const playerState = Rebar.player.useState(somePlayer);

// Use character document for weapons
playerState.sync();

// Save player state
playerState.save();

// Override and apply some state to a player
playerWeapons.apply({ pos: alt.Vector3.zero });
```
