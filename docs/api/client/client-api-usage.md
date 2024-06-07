# Client API Usage

The client API can be accessed through a single import.

If you want more direct imports, those are also available through your intellisense.

## alt:V Based Import
```ts
import * as alt from 'alt-client';

const Rebar = alt.getMeta('RebarClient');
```

## Direct Import
```ts
import { useRebar } from '@Client/index.js';

const Rebar = useRebar();

// Example(s)
const document = Rebar.document.account.useAccount();
const audioInstance = Rebar.player.useAudio(somePlayer);
```
