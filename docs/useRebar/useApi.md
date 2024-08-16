---
order: 950
---

# useApi

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

```ts
import { useApi } from '@Server/api/index.js';

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
    export interface ServerPlugin {
        ['my-cool-api']: ReturnType<typeof useMyCoolAPI>;
    }
}

// Really important to execute the return of your function
useApi().register('my-cool-api', useMyCoolAPI());
```

3. Done

## How to Get an API

This is all that's necessary to start working with other plugin APIs.

If you do not want to worry about load order. Consider the following pattern:

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const api = Rebar.useApi();

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

4. Using a sperate api.ts
## How to put the API into a seperate file

If you want to write your API in a separate file like an 'api.ts' then you have to import it in your index.ts because only the 'index.ts' is loaded by default. You can then use the API in any other plugin

```ts
import ‘path_to_file/api.js’;
```

