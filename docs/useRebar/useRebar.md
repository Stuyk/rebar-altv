---
order: 1000
---

# useRebar

The server API can be accessed through a single import.

If you want more direct imports, those are also available through your intellisense.

## Direct Import

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Example(s)
const document = Rebar.document.account.useAccount();
const audioInstance = Rebar.player.useAudio(somePlayer);
```

## alt:V Based Import

```ts
import * as alt from 'alt-server';

const Rebar = alt.getMeta('Rebar');
```
