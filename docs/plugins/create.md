# Create a Plugin

If you wish to create plugins then you need to understand the basic structure of a plugin.

1. Create a folder inside `src/plugins` and name it something unique
2. Create these additional folders under the new folder you created
    1. `client`
    2. `server`
    3. `translate`
    4. `webview`

## client

This is where the client-side code belongs. You **cannot use NPM packages** in these files.

Ensure that you create an `index.ts` file as an entry point for your client code.

```ts
// client/index.ts
import * as alt from 'alt-client';
import '../translate/index.js';
import { useTranslate } from '@Shared/translate.js';

const { t } = useTranslate('en');

alt.log(t('example.hello-from-client'));
```

## server

This is where server-side code belongs.

Ensure that you create an `index.ts` file as an entry point for your server code.

```ts
// server/index.ts
import * as alt from 'alt-server';
import '../translate/index.js';
import { useTranslate } from '@Shared/translate.js';

const { t } = useTranslate('en');

alt.log(t('example.hello-from-server'));
```

## translate

Translations can be used on `client-side`, `server-side`, or `webview` as long as you import the translation file.

```ts
// translate/index.ts

// It is recommended to use relative paths for translation imports
import { useTranslate } from '../../../main/shared/translate.js';
const { setBulk } = useTranslate();

setBulk({
    en: {
        'example.hello-from-server': 'Hello from server-side!',
        'example.hello-from-client': 'Hello from client-side!',
        'example.hello-from-webview': 'Hello from webview!',
    },
});
```

## webview

Webview pages should always have unique names that differentiate from other plugins. Ensure you give your `vue` file a unique name.

```jsx
// MyPluginExample.vue
<script lang="ts" setup>
import '../translate/index';
import { useTranslate } from '../../../main/shared/translate';

const { t } = useTranslate('en');

console.log(`Hello from webview`);
</script>

<template>
    <div>
        <div class="text-red-500 text-lg">{{ t('example.hello-from-webview') }}</div>
    </div>
</template>
```
