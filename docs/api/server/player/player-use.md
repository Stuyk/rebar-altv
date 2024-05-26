---
order: -5
---

# usePlayer

While there is access to individual waypoints.

It is recommended that if you're accessing many waypoints to use the `usePlayer` function to get direct access to all functions without having to pass the player each time.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function doSomething(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);

    // You also have direct access to the `character` document if it's already bound.
    rPlayer.notify.sendMessage(`{FFFFFF} Bank Balanace: $${rPlayer.character.getField('cash')}`);
    rPlayer.notify.sendMessage(`{FFFFFF} Cash Balanace: $${rPlayer.character.getField('bank')}`);
    rPlayer.notify.showNotification(`You checked your account balance!`);
}
```
