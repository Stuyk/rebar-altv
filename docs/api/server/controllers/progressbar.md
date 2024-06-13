# Progress Bars

![](../../../static/controllers/progressbar.png)

## Local Progress Bars

These are seen by a single player.

### Timed Progress Bar

```ts
const bar = Rebar.controllers.useProgressbarLocal(
    somePlayer,
    {
        label: 'hi',
        value: 0,
        maxValue: 100,
        pos: player.pos,
    },
    true, // This makes the bar timed
);

bar.onFinish(() => {
    console.log('bar complete, with a callback');
});

await bar.waitForFinish();
console.log('bar complete via async');
```

### Manual Control Progress Bar

```ts
const bar = Rebar.controllers.useProgressbarGlobal(somePlayer, {
    label: 'hi',
    value: 0,
    maxValue: 100,
    pos: player.pos,
});

// Increments the bar by 1 every 2 seconds until it hits 100
alt.setInterval(() => {
    bar.updateProgress(bar.getValue() + 1);
    bar.updateLabel(`${bar.getValue()}/${bar.Value()}`);
}, 2000);

bar.onFinish(() => {
    console.log('bar complete, with a callback');
});

await bar.waitForFinish();
console.log('bar complete via async');
```

## Global Progress Bars

These are seen by all players, and are can be seen when they are in range of the progress bar.

### Timed Progress Bar

```ts
const bar = Rebar.controllers.useProgressbarGlobal(
    {
        label: 'hi',
        value: 0,
        maxValue: 100,
        pos: player.pos,
    },
    true, // This makes the bar timed
);

bar.onFinish(() => {
    console.log('bar complete, with a callback');
});

await bar.waitForFinish();
console.log('bar complete via async');
```

### Manual Control Progress Bar

```ts
const bar = Rebar.controllers.useProgressbarGlobal({
    label: 'hi',
    value: 0,
    maxValue: 100,
    pos: player.pos,
});

// Increments the bar by 1 every 2 seconds until it hits 100
alt.setInterval(() => {
    bar.updateProgress(bar.getValue() + 1);
    bar.updateLabel(`${bar.getValue()}/${bar.Value()}`);
}, 2000);

bar.onFinish(() => {
    console.log('bar complete, with a callback');
});

await bar.waitForFinish();
console.log('bar complete via async');
```
