# useKeypress

Keypress lets you handle key up and key down from server-side. It completely ignores if a `page` is open.

```ts
const keypress = Rebar.useKeypress();

keypress.on(
    118,
    (player: alt.Player) => {
        console.log('up!');
    },
    (player: alt.Player) => {
        console.log('down!');
    },
);
```
