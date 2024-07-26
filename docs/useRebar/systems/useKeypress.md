# useKeypress

Keypress lets you handle key up and key down from server-side. It completely ignores if a `page` is open.

## on

Each callback is called when the key is pressed down, and when the key is let go after being held down.

```ts
// Uses the 'F3' key
Rebar.systems.useKeypress().on(
    114,
    // on key up
    (player) => {
        alt.log('they let go of the key');
    },
    // on key down
    (player) => {
        alt.log('they pressed the key down');
    },
);
```

## onHold

The `onHold` callback is invoked after `2s` on client-side.

Additionally, the callback time is verified server-side as well to ensure callback times are accurate and can't be invoked manually.

### Simple Usage

If you only want it to be invoked if the player holds a key long enough, then here's the short form.

```ts
// Uses the 'F4' key
Rebar.systems.useKeypress().onHold(115, {
    hold: (player) => {
        console.log('player held the key long enough');
    },
});
```

### Advanced Usage

```ts
function handleHoldUp(player: alt.Player) {
    alt.log('just let go of held key');
}

function handleHoldDown(player: alt.Player) {
    alt.log('just pressed held key down');
}

function handleHoldKey(player: alt.Player) {
    alt.log('player held the key for a long time');
}

// Uses the 'F4' key
Rebar.systems.useKeypress().onHold(115, { hold: handleHoldKey, up: handleHoldUp, down: handleHoldDown });
```
