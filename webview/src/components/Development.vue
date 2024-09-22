<script lang="ts" setup>
import { ref, computed } from 'vue';
import { PLUGIN_IMPORTS } from '../../pages/plugins';
import { usePages } from '../../composables/usePages';

const { show, hide } = usePages();

const showToolbar = ref(false);
const visiblePages = ref<{ [key: string]: boolean }>({});

function isVisible(pageName: string) {
    return visiblePages.value[pageName] ? true : false;
}

function togglePage(pageName: string) {
    const isVisible = visiblePages.value[pageName] ? true : false;
    if (isVisible) {
        hide(pageName);
    } else {
        show(pageName, 'page');
    }
    visiblePages.value[pageName] = isVisible ? false : true;
}

const pages = computed(() => {
    return Object.keys(PLUGIN_IMPORTS);
});
</script>

<template>
    <div class="fixed right-0 top-0">
        <div v-if="showToolbar" class="items-center justify-center p-4">
            <div class="flex w-72 flex-col rounded bg-neutral-100 p-4 shadow-lg">
                <div class="max-h-[calc(100vh-7rem)] overflow-y-auto">
                    <div class="flex flex-col gap-2">
                        <div
                            v-for="(pageName, index) in pages"
                            :key="index"
                            class="flex w-full justify-between rounded p-2 hover:cursor-pointer hover:opacity-50"
                            :class="isVisible(pageName) ? ['bg-green-200'] : ['bg-red-200']"
                            @click="togglePage(pageName)"
                        >
                            <span class="text-sm font-bold">{{ pageName }}</span>
                        </div>
                    </div>
                </div>
                <div
                    class="mt-2 rounded p-2 text-right text-sm font-bold text-neutral-600 hover:cursor-pointer hover:bg-neutral-200"
                    @click="showToolbar = false"
                >
                    Close
                </div>
            </div>
        </div>
        <div v-else @click="showToolbar = true" class="p-4">
            <div
                class="rounded-md bg-neutral-100 px-2 py-1 text-sm font-bold shadow hover:cursor-pointer hover:bg-neutral-200"
            >
                &lt;
            </div>
        </div>
    </div>
</template>
