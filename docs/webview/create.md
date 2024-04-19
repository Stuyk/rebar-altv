# Create a Webview

First, make sure you've created a [plugin](../plugins/create.md).

If you are using Visual Studio Code, make sure to install [the Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

Create a `.vue` file, and create a basic Vue 3 template.

```jsx
// src/plugins/some-plugin/webview/MyExampleView.vue

<script lang="ts" setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
    <div>
        <p>Hello World!</p>
        <button @click="count++">Click Count: {{ count }}</button>
    </div>
</template>
```

## Preview the Page

You can preview the page by running the following in a `terminal`.

```
pnpm webview:dev
```

You can open `http://localhost:5173` in your browser to view the page.

Click the `Arrow in the Top Right` and then click on your page to see it rendered.

## Showing in-game

!!!
These documents are a work in progress, this will be completed soon.
!!!
