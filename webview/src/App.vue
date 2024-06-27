<script setup lang="ts">
import { onMounted } from 'vue';
import { useAudio } from '../composables/useAudio';
import { useMessenger } from '../composables/useMessenger';
import { useMinimap } from '../composables/useMinimap';
import { usePageEvents } from '../composables/usePageEvents';
import { usePages } from '../composables/usePages';
import { useSyncedMeta } from '../composables/useSyncedMeta';
import DevelopmentBar from './components/Development.vue';

const { pagesPersistent, pagesOverlay, page } = usePages();
const { init } = usePageEvents();
const isDeveloping = 'alt' in window ? false : true;

function handleMount() {
    if (!('alt' in window)) {
        return;
    }

    init();
    useAudio();
    useMessenger();
    useMinimap().init();
    useSyncedMeta().init();
}

onMounted(handleMount);
</script>

<template>
    <div
        class="relative left-0 top-0 flex h-full min-h-full w-full min-w-full overflow-hidden"
        :class="isDeveloping ? ['devbg'] : []"
    >
        <DevelopmentBar v-if="isDeveloping" />
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

<style scoped>
.devbg {
    background: url('./devbg.jpg');
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;
}
</style>
