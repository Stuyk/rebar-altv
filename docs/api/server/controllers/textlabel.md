# Text Labels

Text labels are floating pieces of text that can be seen in-game in a 3D space.

## Global Text Labels

Global text labels can be seen by all players.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Create text label
// you can specify streaming distance from 1 to 50, it will reset to 50 if not specified or if it is greater than 50.
const label = Rebar.controllers.useTextLabelGlobal(
    { text: '~r~Hello World', pos: new alt.Vector3(0, 0, 0) },
    20, //streaming distance, completely optional
);

// Update text to say something else
label.update({ text: 'New Text!' });

// Remove text label
label.destroy();
```

## Local Text Labels

Local text labels can only be seen by a single player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Create text label
const label = Rebar.controllers.useTextLabelLocal(somePlayer, { text: 'Hello World', pos: new alt.Vector3(0, 0, 0) });

// Update text label
label.update({ text: 'hello world!!!' });

// Remove local text label
label.destroy();
```
