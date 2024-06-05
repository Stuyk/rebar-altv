# usePlayerStats

This specific composable is for gather information from client-side, and rendering it in the WebView.

Here's an example of how to use it.

```html
<script lang="ts" setup>
    import { usePlayerStats } from '@Composables/usePlayerStats';

    const {
        health,
        armour,
        speed,
        weather,
        crossingRoad,
        street,
        engineOn,
        fps,
        gear,
        headlights,
        highbeams,
        inVehicle,
        inWater,
        indicatorLights,
        isTalking,
        maxGear,
        ping,
        stamina,
        time,
        vehicleHealth,
        weapon,
    } = usePlayerStats();
</script>

<template>
    <div class="flex flex-col text-white text-lg font-bold w-32">
        <span>Health: {{ health }}</span>
        <span>Armour: {{ armour }}</span>
        <span>Speed: {{ speed }}</span>
        <span>Weather: {{ weather }}</span>
    </div>
</template>
```
