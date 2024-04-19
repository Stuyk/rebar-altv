# Account Document

An account document is a set of data that is bound to the player until they disconnect.

## Binding Data

You should bind account data when they authenticate to your server.

```ts
import { useAccount, useAccountBinder } from '@Server/document/account.js';

// ... some function here
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

//... some function here
const account = useAccount(player);
const data = account.get();
console.log(data.email);
```

## Setting Data

Data can easily be appended or set in two different ways.

```ts
import { useAccount, useAccountBinder } from '@Server/document/account.js';

const account = useAccount(player);

type CustomAccount = { whatever: string };

//...some function
// Single field
account.set('banned', true);

// Multi-field
account.setBulk({ banned: true, reason: 'big nerd' });

// Custom-field
account.setBulk<CustomAccount>({ banned: true, reason: 'big nerd', whatever: 'hi' });
```
