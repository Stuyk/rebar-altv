# API

API allows for plugins to register their own APIs and make them available globally.

However, they are limited to either server-side or client-side.

This reduces the complexity to import functions from other plugins, or export functions for other plugins.

## How to Declare an API

1. Ensure you have an API setup in your plugin.

```ts
export function useMyCoolAPI() {
    function logPlayerName(player: alt.Player) {
        console.log(player.name);
    }

    return {
        logPlayerName,
    };
}
```

2. Create a global declaration for your API.

+++ Without arguments
```ts
import { useClientApi } from '@Client/api/index.js';

export function useMyCoolAPI() {
    function logPlayerName(player: alt.Player) {
        console.log(player.name);
    }

    return {
        logPlayerName,
    };
}

// Declare global to TypeScript recognizes the typings
declare global {
    export interface ClientPlugin {
        ['my-cool-api']: ReturnType<typeof useMyCoolAPI>;
    }
}

// Really important to execute the return of your function
useClientApi().register('my-cool-api', useMyCoolAPI());
```

+++ With arguments

```ts
import { useClientApi } from '@Client/api/index.js';

export function useMyCoolAPI(player: alt.Player) {
    function logPlayerName() {
        console.log(player.name);
    }

    return {
        logPlayerName,
    };
}

// Declare global to TypeScript recognizes the typings
declare global {
    export interface ClientPlugin {
        ['my-cool-api']: typeof useMyCoolAPI;
    }
}

// Don't execute a composable here, because it will be executed later.
useClientApi().register('my-cool-api', useMyCoolAPI);
```

+++

3. Done

## How to Get an API

This is all that's necessary to start working with other plugin APIs

Below is dependent on load order, so your mileage may vary.

+++ Without arguments

```ts
import { useClientApi } from '@Client/api/index.js';

const myCoolAPI = useClientApi().get('my-cool-api');

function someFunction(somePlayer: alt.Player) {
    myCoolAPI.logPlayerName(somePlayer);
}
```

If you do not want to worry about load order. Consider the following pattern:

```ts
import { useClientApi } from '@Client/api/index.js';

async function init() {
   const myCoolAPI = await useClientApi().getAsync('my-cool-api');
   myCoolAPI.logPlayerName(somePlayer);
}
```

+++ With arguments

```ts
import { useClientApi } from '@Client/api/index.js';

const useMyCoolAPI = useClientApi().get('my-cool-api');

function someFunction(somePlayer: alt.Player) {
    useMyCoolAPI(somePlayer).logPlayerName();
}
```
+++

If you do not want to worry about load order. Consider the following pattern:

```ts
import * as alt from 'alt-client';
import { useClientApi } from '@Client/api/index.js';

const api = useClientApi();

async function init() {
    // Wait for isReady and Get the API
    const authApi = await api.getAsync('auth-api');

    // Hook in your events
    authApi.onLogin((player) => {
        alt.log('Player Ready!');
    });
}

init();
```
