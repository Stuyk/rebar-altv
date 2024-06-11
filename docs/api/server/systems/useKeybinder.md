# useKeybinder

A simple way to bind keybinds to server-side functionality.

You can determine what key is pressed by using [keycode.info](https://keycode.info).

All client-to-server keybinds are rate limited at 500ms.

```ts
const Keybinder = Rebar.useKeybinder();

// 75 - k
Keybinder.on(75, (player) => {
    console.log('pressed k');
});
```

## Protecting Keybinds

If you want your keybinds to be further protected from spam.

Consider using the various callback utilities for callback protection.

-   [Callback Rate Limiter](../utility/rate-limit-callback.md)
-   [Callback Permissions](../utility/protect-callback.md)
