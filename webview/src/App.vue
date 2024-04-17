<script setup lang="ts">
import { usePages } from "../composables/usePages";

const { pagesPersistent, pagesDynamic } = usePages();
</script>

<template>
  <div class="flex relative top-0 left-0">
    <!-- Persistent Pages -->
    <template v-for="(pageInfo, index) in pagesPersistent">
      <component v-if="pageInfo.visible" :is="pageInfo.name" :key="index" />
    </template>
    <!-- Dynamic Pages -->
    <template v-for="(pageInfo, index) in pagesDynamic">
      <component v-if="pageInfo.visible" :is="pageInfo.name" :key="index" />
    </template>
  </div>
</template>
