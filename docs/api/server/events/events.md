# Rebar Event Usage

These events are unique to the Rebar framework, and help provide information about when something happens.

## Usage

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

// Called when an account is bound to a player
RebarEvents.on('account-bound', (player, document) => {
    console.log(document);
});

// Called when a character is bound to a player
RebarEvents.on('character-bound', (player, document) => {
    console.log(document);
});

// Called when a vehicle document is bound to a vehicle
RebarEvents.on('vehicle-bound', (vehicle, document) => {
    console.log(document);
});

// Called when a player sends a message
RebarEvents.on('message', (player, msg) => {
    console.log(msg);
});
```
