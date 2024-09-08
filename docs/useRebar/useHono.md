---
order: 425
---

# useHono

The `useHono` function is designed to extend the game-server web API server by utilizing the Hono framework. It provides mechanisms to register new routes and use middlewares for handling incoming requests.

## addRouter

Registers a new router with the main Hono application.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const hono = Rebar.useHono();

const app = new Hono<{ Bindings: HttpBindings }>();

// Do stuff with your Hono app.

hono.addRouter('/api/v1', app);
```

## midlewares

A collection of middleware functions for request handling.

### localOnly

Middleware to restrict access to requests coming from the local machine (IP address `127.0.0.1`).

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const hono = Rebar.useHono();

const app = new Hono<{ Bindings: HttpBindings }>();

app.get('/ban', hono.middlewares.localOnly, (c) => {
    // Handle the request
});

hono.addRouter('/api/v1', app);
```

> You can also build your own middlewares, such as check auth token or whatever else.

## Example usage

Here is an example of creating a `/ban` endpoint, that will allow you to ban an account via api.

```ts
import { HttpBindings } from "@hono/node-server";
import { useRebar } from "@Server/index.js";
import { Account } from "@Shared/types/account.js";
import { Hono } from "hono";

const Rebar = useRebar();
const hono = Rebar.useHono();
const app = new Hono<{ Bindings: HttpBindings }>();

app.get('/ban', hono.middlewares.localOnly, (c) => {
    let { reason, _id } = c.req.query();

    if (!_id) {
        c.status(400);
        return c.json({ data: 'ID was not provided' });
    }

    if (!reason) {
        reason = 'No Reason Given';
    }

    const onlinePlayer = Rebar.get.usePlayerGetter().byAccount(_id);
    if (!onlinePlayer) {
        const document = Rebar.document.virtual.useVirtual<Account>(_id, Rebar.database.CollectionNames.Accounts);
        if (!document.get()) {
            c.status(400);
            return c.json({ data: `Account does not exist on the server` });
        } else {
            document.setBulk({
                banned: true,
                reason,
            });
        }
    } else {
        const rPlayer = Rebar.usePlayer(onlinePlayer);
        rPlayer.account.setBanned(reason);
    }
    c.status(200);
    return c.json({ data: `Banned ${_id} with reason '${reason}'` });
})

hono.addRouter('/api/v1', app);
```