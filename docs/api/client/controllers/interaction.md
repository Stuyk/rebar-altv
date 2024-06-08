# Interaction

Listen on client-side for when a player enters an interaction or leaves an interaction.

```ts
import { useClientInteraction } from '@Client/controllers/interaction.js';

const interaction = useClientInteraction();

// Listen for when the player enters a interaction
interaction.onEnter(onEnter);

function onEnter(message: string, uid: string, pos: alt.Vector3) {
    alt.log(message);
    alt.log(`UID: ${uid} | Pos: ${JSON.stringify(pos)}`);
}

// Listen for when the player leaves a interaction
interaction.onLeave(onLeave);

function onLeave(message: string, uid: string, pos: alt.Vector3) {
    alt.log(message);
    alt.log(`UID: ${uid} | Pos: ${JSON.stringify(pos)}`);
}
```
