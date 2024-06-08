# Protect Callback

When you're using events, or you need callbacks to be fully protected and permissioned this utility functions provides a simple wrapper to check for permissions before the callback is executed.

This prevents unauthorized users from executing callbacks at the event level.

A simple, but easy way to add permissions when recieving client-side events, or other callbacks.

```ts
// Functions like a normal alt:V on-client callback, or normal function.
// Only requirement is that the first argument is a player.
function handleEvent(player: alt.Player, arg1: string, arg2: string) {
    //
}

alt.onClient(
    'protected-event',
    Rebar.utility.useProtectCallback(handleEvent, {
        // This checks if the account has a permission
        account: ['admin'],

        // This checks if a character has some other permission
        character: ['do-something'],

        // This checks if a player has a group permission
        group: {
            police: ['cadet'],
        },
    }),
);
```
