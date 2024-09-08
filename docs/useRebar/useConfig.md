---
order: 900
---

# useConfig

This document provides an overview of the configuration management for a Rebar server application.

## Features

-   Parsing environment variables.
-   Setting a default value if env variable was not defined.
-   Basic type validation - number, boolean, string (by default).

## Defaults

| Config Variable | Env Variable  | Type   | Default                   |
|-----------------|---------------|--------|---------------------------|
| `mongodb`         | `MONGODB`       | `string` | `mongodb://127.0.0.1:27017` |
| `database_name`   | `DATABASE_NAME` | `string` | `Rebar`                     |

## Usage

Config defined as an interface, all methods covered with type hints, so you will see all variables and correct types on each method call.

### Get config object

You can get the whole config object this way:

```ts
import { useRebar } from '@Server/index.js';

const config = useRebar().useConfig().get();
// config === {
//     mongodb: 'mongodb://...',
// }
}
```

### Get variable from config

You can also get a specific value from config:

```ts
import { useRebar } from '@Server/index.js';

const mongodb = useRebar().useConfig().getField('mongodb');
// typeof mongodb === 'string'
```

### Set new variable

To be able to extend default Rebar config, you can extend Config interface this way:

```ts /plugins/shared/interfaces.ts
import '@Server/config/index.js';

// Extend NodeJS.ProcessEnv, so it will show you that it exists on process.env.SOME_ENV_VARIABLE.
declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            SOME_ENV_VARIABLE: string;
        }
    }
}

// Extend Config interface, don't forget to import module first to make TypeScript magic work.
declare module '@Server/config/index.js' {
    interface Config {
        // Name of key could be different from env variable, it doesn't matter.
        some_variable: number;
    }
}
```

After you've extended Config interface, you'll be able to use it's keys to initialize config variable against the env.

```ts /plugins/server/index.ts
/* .env file content:
SOME_ENV_VARIABLE=12
*/

import { useRebar } from '@Server/index.js';

const config = useRebar().useConfig();

config.initFromEnv(
    'some_variable', // Config interface key.
    {
        env: 'SOME_ENV_VARIABLE', // Required.
        default: 500, // Optional, default: undefined.
        required: true, // Optional, default: true.
        type: 'number', // Optional, default: undefined (interpreted as string on parse, no type cast).
    },
);

// If default is not set or set as `undefined`, there is no ENV variable declared and required=true
// You will get this exception on server startup:
// Error: `SOME_ENV_VARIABLE should be defined in .env file.`
```

!!!danger Important
If you will try to parse not a number as number, you will get an uncaught exception:

```ts /plugins/server/index.ts
/* .env file content:
SOME_ENV_VARIABLE=dummy
*/

import { useRebar } from '@Server/index.js';

const config = useRebar().useConfig();

config.initFromEnv(
    'some_variable', // Config interface key.
    {
        env: 'SOME_ENV_VARIABLE', // Required.
        default: 500, // Optional, default: undefined.
        required: true, // Optional, default: true.
        type: 'number', // Optional, default: undefined (interpreted as string on parse, no type cast).
    },
);
```

You will get an uncaught exception here, the server won't start and you will see this in logs:

`Error: Can't set auth_session_lifetime: Can't parse 'dummy', it is not a valid number`
!!!

### Override config variable in runtime

You can change variable value in runtime. Be careful with types.

```ts /plugins/server/index.ts
import { useRebar } from '@Server/index.js';

const config = useRebar().useConfig();

// Correct:
config.set('some_variable', 1000);

// Incorrect:
// There you will see an error in IDE, because it checks the type of `some_variable` in Config interface.
// !!! It won't raise an error in runtime, will just write a wrong value to the config.
config.set('some_variable', '1000');
```
