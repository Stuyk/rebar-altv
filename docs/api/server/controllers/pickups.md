# Pickups

Pickups are collisions you can run over with a specific weapon model.

They're traditionally seen in GTA:Online, but this is a more server-side implementation of the pickups.

![](../../../static/controllers/pickup.png)

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WeaponPickup } from '@Shared/types/pickup.js';

const Rebar = useRebar();

function handlePickup(player: alt.Player, pickup: WeaponPickup, destroy: Function) {
    if (pickup.pickup !== 'PICKUP_WEAPON_GRENADELAUNCHER') {
        return;
    }

    player.giveWeapon(0xa284510b, 25, true);

    // This will destroy the pickup forever, after it has been picked up.
    destroy();
}

const pickup = Rebar.controllers.usePickupGlobal({
    pickup: 'PICKUP_WEAPON_GRENADELAUNCHER',
    pos: SpawnPos.add(0, 0, 1),
});

pickup.on(handlePickup);
```
