# useD2DTextLabel

These are the most performant Text Labels that exist for alt:V.

These labels are specifically built for in-world use; and provide a way to synchronize with all players or some players.

## Server

This example shows a message, and then changes the text to New Text!

```ts
const label = Rebar.controllers.useD2DTextLabel({
    pos: player.pos,
    text: 'Hey there!',
});

label.update({ text: 'New Text!' });
```

## Local

This example iterates through images passed through the `images` directory.

```ts
const label = Rebar.controllers.useD2DTextLabelLocal(player, {
    pos: player.pos,
    text: '<img src="@images/Gold_1.png" />',
});

let index = 1;
alt.setInterval(() => {
    index += 1;

    if (index >= 11) {
        index = 1;
    }

    label.update({ text: `<img src="@images/Gold_${index}.png" />` });
}, 50);
```
