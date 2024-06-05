# useMinimap

Gets minimap positional data and makes it available in the Webview.

Below is an example of how to move some text next to the minimap.

It will automatically update the minimap positional data when resolution is changed.

```html
<script lang="ts" setup>
    import { computed } from 'vue';
    import { useMinimap } from '@Composables/useMinimap';

    const { minimap } = useMinimap();

    const getStylePosition = computed(() => {
        if (!minimap.value) {
            return ``;
        }

        return [`left: ${minimap.value.left + minimap.value.width}px`, `top: ${minimap.value.top}px`];
    });
</script>

<template>
    <div>
        <span class="fixed font-bold text-white" :style="getStylePosition">Hello World!</span>
    </div>
</template>
```
