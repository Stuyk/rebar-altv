# useStreamSyncedBinder

What this allows you to do is target a specific document field from a `Character` or `Vehicle` document and automatically synchronize the document data to client-side through `streamSyncedMeta`.

Whenever the value changes, it automatically updates for a player or vehicle.

For instance, if specify the propery `money` and `money` is updated for the player, it will be available on client-side, and in the webview.

```ts
import { useRebar } from '../../../main/server/index.js';

const Rebar = useRebar();
const SyncedBinder = Rebar.systems.useStreamSyncedBinder();

// Bind character document data
SyncedBinder.syncCharacterKey('money');
SyncedBinder.syncCharacterKey('name');

// Bind vehicle document data
SyncedBinder.syncVehicleKey('fuel');
```
