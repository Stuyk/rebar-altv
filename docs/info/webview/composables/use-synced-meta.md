# useSyncedMeta

When using the [Stream Synced Binder](../../../useRebar/systems/useStreamSyncedBinder.md), this webview component allows you to get that data as vue refs.

```jsx
<script lang="ts" setup>
import { useSyncedMeta } from '../../../../webview/composables/useSyncedMeta';

const syncedMeta = useSyncedMeta();

const character = syncedMeta.getCharacter();
const vehicle = syncedMeta.getVehicle();
</script>

<template>
    <div class="fixed left-0 top-0 bg-black text-white">
        <div class="text-2xl">Character</div>
        {{ character }}
        <div class="text-2xl">Vehicle</div>
        {{ vehicle }}
    </div>
</template>
```
