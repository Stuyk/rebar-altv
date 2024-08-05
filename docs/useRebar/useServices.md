---
order: 550
---

# useServices

Services provide a way for plugin developers to call a shared interface handled by Rebar to handle common place functionality.

Examples being...

-   Adding Currency
-   Subtracting Currency
-   Adding an Item
-   Removing an Item
-   Checking if an Item Exists
-   Changing Weather
-   Getting Weather
-   Changing Time
-   Getting Time
-   etc.

## Example

### Service Register Example

```ts
Rebar.services.useServiceRegister().register('items', {
    add: async (player, id, quantity) => {
        // Do standard add items to inventory, and whatever else is necessary
        // such as inventory checks, weight checks, etc.
        // Return false if added incorrectly

        // Return true if added correctly
        return true;
    },
    sub: async (player, id quantity) => {


        // Return true if subtracted enough
        return true;
    },
    has: async (player, id, quantity) => {
        // Return true if has enough of an item
    },
    remove: async (player, uid) => {
        // return true if removed an item entirely
    }
});
```

### Service Invoke Example

```ts
async function addFishingRod(player: alt.Player) {
    const didAdd = await useItemService().add(player, 'fishingrod', 1);
    if (!didAdd) {
        // fishing rod was not added
        return;
    }

    // fishing rod was added, do something here...
}
```

## useCurrencyService

### Register

```ts
Rebar.services.useServiceRegister().register('currencyService', {
    async add(player, type, quantity) {
        // Handle add logic...
        // Return true if added successfully
        return true;
    },
    async sub(player, type, quantity) {
        // Handle sub logic...
        // Return true if added successfully
        return true;
    },
    async has(player, type, quantity) {
        // Handle has logic...
        // Return true if has enough of a currency type
        return true;
    },
});
```

### add

Adds a specified currency type to a given player with a specific quantity.

```ts
const didAdd = await Rebar.services.useCurrencyService().add(somePlayer, 'cash', 5);
```

### sub

Subtracts a specified currency type to a given player with a specific quantity.

```ts
const didSub = await Rebar.services.useCurrencyService().sub(somePlayer, 'cash', 5);
```

### has

Checks if the player has enough of a specified currency type.

```ts
const has = await Rebar.services.useCurrencyService().has(somePlayer, 'cash');
```

## useDeathService

### Register

```ts
Rebar.services.useServiceRegister().register('deathService', {
    respawn(player, pos) {
        // handle respawning a player somewhere
    },
    revive(player) {
        // handle reviving a player in the same position
    },
});
```

### respawn

Respawn is meant to be used as a way to respawn the player through some other means in your game mode.

```ts
Rebar.services.useDeathService().respawn(somePlayer, new alt.Vector3(0, 0, 0));
```

### revive

Revive is meant to be used to respawn the player in their same position

```ts
Rebar.services.useDeathService().revive(somePlayer);
```

## useItemService

### Register

```ts
Rebar.services.useServiceRegister().register('itemService', {
    async add(player, id, quantity, data) {
        // this should try and add an item quantity to the given player, with optional specified data
        // Return false if they run out of room, or exceed weight. Up to library creator.

        return true;
    },
    async sub(player, id, quantity) {
        // This should try and subtract item quantity from the given player, with optional specified data
        // Return false if they don't have enough

        return true;
    },
    async has(player, id, quantity) {
        // This should try and see if the player has a specified item, and a given quantity
        // Return false if they do not

        return true;
    },
    async remove(player, uid) {
        // This should return true if the item can successfully be removed entirely by a unique identifier
        // Every item should have some form of uid for easy removal
        // Return false if the uid item does not exist

        return true;
    },
});
```

### add

This should try and add an item quantity to the given player.

This will return `false` if the item cannot be added.

```ts
const didAdd = Rebar.services.useItemService().add(somePlayer, 'fishing-rod', 1, { customData: 'here' });
```

### sub

This should try and subtract an item quantity from the given player.

This will return `false` if the item quantity cannot be subtracted.

```ts
const didSub = Rebar.services.useItemService().sub(somePlayer, 'fishing-rod', 1);
```

### has

This should try and return `true/false` if the player has a specific item and a given quantity.

```ts
const hasEnough = Rebar.services.useItemService().has(somePlayer, 'cabbage-seeds', 100);
```

### remove

This should try and remove any item with a given `uid` and remove it entirely from the inventory.

_UID stands for unique identifier._

```ts
const isRemoved = await Rebar.services.useItemService().remove(somePlayer, 'c03b9f08-dd85-46fe-ba07-429b0f79deaf');
```

## useNotificationService

### Register

```ts
Rebar.services.useServiceRegister().register('notificationService', {
    broadcast(msg, type) {
        // Should send a message to all logged in players in the form of a notification
        // Type can literally be anything you want
    },
    emit(player, msg, type) {
        // Should send a message to the given player in the form of a notification
        // Type can literally be anything you want
    },
});
```

### broadcast

```ts
Rebar.services.useNotificationService().broadcast('hello everyone!', 'announcement');
```

### emit

```ts
Rebar.services.useNotificationService().emit(somePlayer, 'hello person!', 'info');
```

## useTimeService

### Register

```ts
Rebar.services.useServiceRegister().register('timeService', {
    setTime(hour, minute, second) {
        // what to do when time is set
    },
});
```

### setTime

Sets the in-game time for the whole server.

`hour`,`minute`,`second`

```ts
Rebar.services.useTimeService().setTime(5, 0, 0);
```

### getTime

Returns the current server time.

```ts
const currentTime = Rebar.services.useTimeService().getTime();
console.log(currentTime.hour);
```

## useWeatherService

### Register

```ts
Rebar.services.useServiceRegister().register('weatherService', {
    setWeather(type) {
        // Passes a single weather type compatible for the game
    },
    setWeatherForecast(types) {
        // Passes an array of weather types to loop through
    },
});
```

### setWeather

```ts
Rebar.services.useWeatherService().setWeather('EXTRASUNNY');
```

### setWeatherForecast

```ts
Rebar.services
    .useWeatherService()
    .setWeather(['EXTRASUNNY', 'CLEARING', 'OVERCAST', 'THUNDER', 'OVERCAST', 'CLEARING']);
```

### getWeather

```ts
const currentWeather = Rebar.services.useWeatherService().getWeather();
```

### getWeatherForecast

```ts
const weatherForecast = Rebar.services.useWeatherService().getWeatherForecast();
```
