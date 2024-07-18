---
order: 700
---

# useEvents

These events are unique to the Rebar framework, and help provide information about when something happens.

## Usage

```ts
import { useRebar } from '@Server/index.js';

const RebarEvents = useRebar().events.useEvents();

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

// Called whenever the time changes
RebarEvents.on('time-changed', (hour, minute, second) => {
    console.log(hour, minute, second);
});

// Called whenever the hour increments by 1
RebarEvents.on('time-hour-changed', (hour) => {
    console.log(hour);
});

// Called whenever the minute increments by 1
RebarEvents.on('time-minute-changed', (minute) => {
    console.log(minute);
});

// Called whenever the second increments by 1
RebarEvents.on('time-second-changed', (second) => {
    console.log(second);
});

// Called when a page is opened
RebarEvents.on('page-opened', (player, pageName) => {
    console.log('page opened');
    console.log(pageName);
});

// Called when a page is closed
RebarEvents.on('page-closed', (player, pageName) => {
    console.log('page closed');
    console.log(pageName);
});
```

## Custom Events

You can declare global custom events in your plugin like this.

```ts
declare global {
    export interface RebarEvents {
        'character-select-done': (player: alt.Player) => void;
    }
}
```
