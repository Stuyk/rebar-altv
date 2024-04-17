<script setup lang="ts">
import { ref } from "vue";

const pages = ref<string[]>();
const persistent = ref<string[]>();
</script>

<template>
  <div>
    <component
      v-for="(pageName, index) in persistent"
      :is="pageName"
      :key="index"
    />
    <component v-for="(pageName, index) in pages" :is="pageName" :key="index" />
  </div>
</template>
