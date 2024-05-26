# Waypoint

Get a waypoint a player may or may not have currently marked on their map.

It can sometimes return undefined.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function doSomething(somePlayer: alt.Player) {
    const pos = await Rebar.player.useWaypoint(somePlayer).get();
    if (!pos) {
        // no waypoint
        return;
    }

    // has waypoint
}
```
