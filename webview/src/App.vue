<script setup lang="ts">
import { onMounted } from 'vue';
import { usePages } from '../composables/usePages';
import { usePageEvents } from '../composables/usePageEvents';

const { pagesPersistent, pagesOverlay, page } = usePages();
const { init } = usePageEvents();

function handleMount() {
    if (!('alt' in window)) {
        return;
    }

    init();
}

onMounted(handleMount);
</script>

<template>
    <div class="flex relative top-0 left-0 w-full h-full overflow-hidden">
        <!-- Persistent Pages -->
        <template v-for="(pageInfo, index) in pagesPersistent">
            <component v-if="pageInfo.visible" :is="pageInfo.name" :key="index" />
        </template>
        <!-- Overlay Pages -->
        <template v-for="(pageInfo, index) in pagesOverlay">
            <component v-if="pageInfo.visible" :is="pageInfo.name" :key="index" />
        </template>
        <!-- Single Page -->
        <template v-if="page">
            <component :is="page" />
        </template>
    </div>
</template>
