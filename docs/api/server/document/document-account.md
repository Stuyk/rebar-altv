# Account

An account document is a set of data that is bound to the player until they disconnect.

It automatically saves data to the MongoDB database when any `set` function is used.

## Binding Data

You should bind account data when they authenticate to your server.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// ... some function
// Use database functions to fetch or create an account
const someAccountData = someDatabaseFetchOrCreateFunction();

// Bind account data to the player after fetching
const document = Rebar.document.account.useAccountBinder(player).bind(someAccountData);
```

## Checking Validity

If you need to check if a player has a document bound to them, you can use the following method.

```ts
if (!Rebar.document.account.useAccount(player).isValid()) {
    // No account bound
    return;
}
```

## Getting Data

Data can be retrieved for the bound account like this.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

//... some function
const account = Rebar.document.account.useAccount(player);
const data = account.get();
console.log(data.email);
```

## Setting Data

Data can easily be appended or set in two different ways.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

type CustomAccount = { whatever: string };

//...some function
const document = Rebar.document.account.useAccount(player);

// Single field
document.set('banned', true);

// Multi-field
document.setBulk({ banned: true, reason: 'big nerd' });

// Custom-field
document.setBulk<CustomAccount>({ banned: true, reason: 'big nerd', whatever: 'hi' });
```

## Getting Characters

When you need to obtain a character file for an account, you can use this function to get all existing characters.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

//...some function
const document = Rebar.document.account.useAccount(player);
const characters = await document.getCharacters();
if (characters.length >= 1) {
    console.log('They have a character');
} else {
    console.log('They do not have a character');
}
```

## Permissions

Permissions for accounts allow permissions to persist across an entire account.

Here's the simplest way to add, remove, and check permissions.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

//...some function
const document = Rebar.document.account.useAccount(player);

await document.permission.addPermission('admin');
await document.permission.removePermission('admin');
const result = document.permission.hasPermission('admin');
```

## Password

When you setup an account you often want to also setup a password, or check a password.

We've made it pretty easy in Rebar to simply check a password to login.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Bind, and get the document
const document = Rebar.document.account.useAccountBinder(player).bind(someAccountDataHere);

// Verify a password for the account
const isValid = document.checkPassword('myplaintextpassword');
```

## Banning

Banning an account is pretty straight forward but it does not prevent new accounts with new ips.

It's simply an account level ban that happens during server runtime.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Bind, and get the document
const document = Rebar.document.account.useAccount(player);
const isValid = document.setBanned('oops your banned');
```
