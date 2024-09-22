# Create a Webview

First, make sure you've created a [plugin](../plugins/structure.md).

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

You can actually show a page from the server-side using the player webview functionality.

However, this section will show you how to do both client and server side.

!!!
When you show a page both the cursor and webview focus will happen automatically.
!!!

## Server Side

Just ensure that you **run the server once** to populate the available pages.

```ts
import { useWebview } from '@Server/player/webview.js';

// Show the page
function someShowFunction(somePlayer: alt.Player) {
    useWebview(somePlayer).show('MyExampleView', 'page');
}

// Hide the page
function someHideFunction(somePlayer: alt.Player) {
    useWebview(somePlayer).hide('MyExampleView');
}
```

## Client side

```ts
import { useWebview } from '@Client/webview/index.js';

// Show a page
useWebview().show('Example', 'page');

// Hide a page
useWebview().hide('Example');
```

That's all it takes to show / hide your custom WebViews.
