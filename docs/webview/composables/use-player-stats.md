# usePlayerStats

This specific composable is for gather information from client-side, and rendering it in the WebView.

Here's an example of how to use it.

```html
<script lang="ts" setup>
    import { usePlayerStats } from '@Composables/usePlayerStats';

    const {
        armour,
        engineOn,
        fps,
        gear,
        headlights,
        health,
        highbeams,
        indicatorLights,
        inVehicle,
        inWater,
        isAiming,
        isFlying,
        isTalking,
        locked,
        lights,
        maxGear,
        ping,
        seatk,
        speed,
        stamina,
        street,
        time,
        vehicleHealth,
        weapon,
        weather,
        zone,
    } = usePlayerStats();
</script>

<template>
    <div class="flex w-32 flex-col text-lg font-bold text-white">
        <span>Health: {{ health }}</span>
        <span>Armour: {{ armour }}</span>
        <span>Speed: {{ speed }}</span>
        <span>Weather: {{ weather }}</span>
    </div>
</template>
```
