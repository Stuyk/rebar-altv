# Interaction

Interactions allow a player to walk up to an invisible trigger and press `E` to interact with it.

!!!
If using `player.pos` for your interaction, ensure you subtract `1` from the z axis to make it usable
!!!

```ts
import { useInteraction } from '@Server/controllers/interaction.js';

// Create an interaction
const interaction = useInteraction(new alt.ColshapeCylinder(0, 0, 0, 5, 2), 'player', 'something-unique');

// Listen for the player to hit 'E' to interact
interaction.on(handleInteraction);

function handleInteraction(player: alt.Player, colshape: alt.Colshape, uid: string) {
    alt.log(`${player.name} has interacted with ${uid}`);
}

// Message to show the player when they interact
// Use `undefined` or `null` to hide default messages
interaction.setMessage('enter', "Press 'E' to Interact");
interaction.setMessage('leave', 'You left the interaction...');

// Removing the interaction also destroys the colshape
interaction.destroy();
```
