---
order: 700
---

# events

These events are unique to the Rebar framework, and help provide information about when something happens.

A lot of these events can only be invoked by using the [Services](./useServices.md) functionality.

## Event Formatting

The syntax for any custom events should be as follows:

```ts
declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:pluginName:eventName': (something: string) => void;
    }
}
```

## Usage

```ts
// Called when an account is bound to a player
alt.on('rebar:playerAccountBound', (player, document) => {
    console.log(document);
});

// Called when a character is bound to a player
alt.on('rebar:playerCharacterBound', (player, document) => {
    console.log(document);
});

// Called when a vehicle document is bound to a vehicle
alt.on('rebar:vehicleBound', (vehicle, document) => {
    console.log(document);
});

// Called when a player sends a message
alt.on('rebar:playerSendMessage', (player, msg) => {
    console.log(msg);
});

// Called whenever the time changes
alt.on('rebar:timeChanged', (hour, minute, second) => {
    console.log(hour, minute, second);
});

// Called whenever the hour increments by 1
alt.on('rebar:timeHourChanged', (hour) => {
    console.log(hour);
});

// Called whenever the minute increments by 1
alt.on('rebar:timeMinuteChanged', (minute) => {
    console.log(minute);
});

// Called whenever the second increments by 1
alt.on('rebar:timeSecondChanged', (second) => {
    console.log(second);
});

// Called when a page is opened
alt.on('rebar:playerPageOpened', (player, pageName) => {
    console.log('page opened');
    console.log(pageName);
});

// Called when a page is closed
alt.on('rebar:playerPageClosed', (player, pageName) => {
    console.log('page closed');
    console.log(pageName);
});

// Called when currency is added to a player
alt.on('rebar:playerCurrencyAdd', (player, type, quantity) => {
    console.log(`Added ${type} of ${quantity}`);
});

// Called when currency is added to a player
alt.on('rebar:playerCurrencySub', (player, type, quantity) => {
    console.log(`Subtracted ${type} of ${quantity}`);
});

// Called when server weather is changed
alt.on('rebar:weatherChanged', (weather) => {
    console.log(`Weather is now ${weather}`);
});

// Called when a door is locked
alt.on('rebar:doorLocked', (uid, initiator: alt.Player) => {
    console.log(`Door ${uid} was locked...`);
});

// Called when a door is locked
alt.on('rebar:doorUnlocked', (uid, initiator: alt.Player | null) => {
    console.log(`Door ${uid} was unlocked...`);
});

// Called when a notification is emitted to a player
alt.on('rebar:playerEmitNotification', (player, msg, type) => {
    console.log(msg);
});

// Called when a notification is broadcast to all players
alt.on('rebar:broadcastNotification', (msg, type) => {
    console.log(msg);
});

// Called when the server invokes a respawn for a given player
alt.on('rebar:playerRespawn', (player, pos) => {
    console.log(`Respawning player...`);
});

// Called when the server invokes a revive for a given player in the same position
alt.on('rebar:playerRevive', (player) => {
    console.log(`Reviving player in position...`);
});

// Called when the server invokes the hot reload functionality
// 99% of devs will not be using this
alt.on('rebar:rpcRestart', () => {
    console.log(`Invoked when hot reload is invoked...`);
});

// Called when any field in the character document is updated for a player
alt.on('rebar:playerCharacterUpdated', (player, fieldName, value) => {
    if (fieldName !== 'armour') {
        return;
    }
});
// Called when any field in the account document is updated for a player
alt.on('rebar:playerAccountUpdated', (player, fieldName, value) => {
    if (fieldName !== 'email') {
        return;
    }
});

// Called when any field in the vehicle document is updated for a vehicle
alt.on('rebar:vehicleUpdated', (vehicle, fieldName, value) => {
    if (fieldName !== 'fuel') {
        return;
    }
});

// Called when an item is added to an entity's document, such as a player.
alt.on('rebar:entityItemAdd', (entity, id, quantity, data) => {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    // Listening for player only item add events
});

// Called when an item quantity is subtracted from an entity's document, such as a player.
alt.on('rebar:entityItemSub', (entity, id, quantity) => {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    // Listening for player only item sub events
});

// Called when an item is removed from entity's document, such as a player
alt.on('rebar:entityItemRemove', (entity, uid) => {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    // Listening for player only item remove events
});

// Called every 1s based on server time, there at 60 ticks in a minute.
alt.on('rebar:onTick', (tick: number) => {
    console.log(tick);
});
```

## Custom Events

You can declare custom `alt.on` events in your plugin like this.

You can invoke them with `alt.emit`.

```ts
declare module 'alt-server' {
    export interface ICustomEmitEvent {
        weatherForecastChanged: (weather: Weathers[]) => void;
        weatherChanged: (weather: Weathers) => void;
    }
}
```
