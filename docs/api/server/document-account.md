# Document - Account

An account document is a set of data that is bound to the player until they disconnect.

It automatically saves data to the MongoDB database when any `set` function is used.

## Binding Data

You should bind account data when they authenticate to your server.

```ts
import { useAccount, useAccountBinder } from '@Server/document/account.js';

// ... some function
// Use database functions to fetch or create an account
const someAccountData = someDatabaseFetchOrCreateFunction();

// Bind account data to the player after fetching
const accBinder = useAccountBinder(player);
accBinder.bind(someAccountData);
```

## Getting Data

Data can be retrieved for the bound account like this.

```ts
import { useAccount, useAccountBinder } from '@Server/document/account.js';

//... some function
const account = useAccount(player);
const data = account.get();
console.log(data.email);
```

## Setting Data

Data can easily be appended or set in two different ways.

```ts
import { useAccount, useAccountBinder } from '@Server/document/account.js';

type CustomAccount = { whatever: string };

//...some function
const document = useAccount(player);

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
import { useAccount } from '@Server/document/account.js';

//...some function
const document = useAccount(player);
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
import { useAccount } from '@Server/document/account.js';

//...some function
const document = useAccount(player);

await document.permission.addPermission('admin');
await document.permission.removePermission('admin');
const result = document.permission.hasPermission('admin');
```
