# useStreamSyncedGetter

When using the [Stream Synced Binder](../../useRebar/systems/useStreamSyncedBinder.md), this allows you to get type safe responses on client-side.

```ts
import * as alt from 'alt-client';
import { useRebarClient } from '../../../main/client/index.js';

const RebarClient = useRebarClient();

const streamGetter = RebarClient.systems.useStreamSyncedGetter();

const money = streamGetter.player(alt.Player.local).get('money');
const name = streamGetter.player(alt.Player.local).get('name');

const fuel = streamGetter.vehicle(someVehicle).get('fuel');
```
