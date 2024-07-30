# useServices

Services provide common shared functionality for common place game mode features.

Services are meant to provide a way for developers to register their service to act on behalf of a common interface.

!!!
There are no limits to how many services can co-exist but there is potential for conflictions if enough services co-exist.

It is recommended to use 1 library per service where possible, and cross compare libraries if necessary.
!!!

## Example

### Service Register Example

```ts
useServices().register('items', {
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
function addFishingRod(player: alt.Player) {
    const didAdd = useItemService().add(player, 'fishingrod', 1);
}
```
