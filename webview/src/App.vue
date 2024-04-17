<script setup lang="ts">
import { ref } from "vue";

const persistPages = ref<string[]>();
const dynamicPages = ref<string[]>();
</script>

<template>
  <div class="flex relative top-0 left-0">
    <component
      v-for="(pageName, index) in persistPages"
      :is="pageName"
      :key="index"
    />
    <component
      v-for="(pageName, index) in dynamicPages"
      :is="pageName"
      :key="index"
    />
  </div>
</template>
