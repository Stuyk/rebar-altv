# Account Document

See [Documents Section](./index.md) for further information on documents.

## Extending Account

Extending the default Account Interface is super simple. Just add a `declare module` to any plugin.

```ts
declare module '@Shared/types/account.js' {
    export interface Account {
        newCoolData: string;
    }
}
```

## useAccountBinder

Always bind a player to account data when they authenticate to your server.

### bind

```ts
// Use database functions to fetch or create an account
const someAccountData = {
    _id: 'jklfdsjklfds',
    username: 'stuyk',
    password: 'somehashedpassword',
};

// Bind account data to the player after fetching
const document = Rebar.document.account.useAccountBinder(player).bind(someAccountData);
```

---

## useAccount

Data can be retrieved for the bound account like this.

```ts
const account = Rebar.document.account.useAccount(player);
const data = account.get();
console.log(data.email);
```

### checkPassword

When you setup an account you often want to also setup a password, or check a password.

We've made it pretty easy in Rebar to simply check a password to login.

```ts
function someFunction(player: alt.Player, someAccountDataHere: Account) {
    const document = Rebar.document.account.useAccountBinder(player).bind(someAccountDataHere);
    const isValid = document.checkPassword('myplaintextpassword');

    if (!isValid) {
        // not a valid password
        return;
    }
}
```

### get

Get the entire document bound to the player.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const data = document.get();
}
```

### getField

Get a specific field for the given document.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const username = document.getField('username');
}
```

### isValid

If you need to check if a player has an account document bound to them, you can use the following method.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);

    if (!document.isValid()) {
        // No account bound
        return;
    }
}
```

### getCharacters

When you need to obtain a character file for an account, you can use this function to get all existing characters.

This will return all character documents that belong to the account.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const characters = await document.getCharacters();
    if (characters.length >= 1) {
        console.log('They have a character');
    } else {
        console.log('They do not have a character');
    }
}
```

### setBanned

Banning an account is pretty straight forward but it does not prevent new accounts with new ips.

It's simply an account level ban that happens during server runtime.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    document.setBanned('oops your banned');
}
```

### set

Set a single field to be stored in the database.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    document.set('banned', true);
}
```

### setBulk

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    document.setBulk({ banned: true, reason: 'big nerd' });
}
```

### [permissions](/userebar/systems/permissions/playerPermissions.md#useaccount)

Click on the link above to see how to use account permissions.

### [groups](/userebar/systems/permissions/playerGroups.md#useaccount)

Click on the link above to see how to use account groups.

## useAccountEvents

Listen for individual key changes for a given document.

Any field from the `account` document is valid.

### on

```ts
const AccountEvents = Rebar.document.account.useAccountEvents();

AccountEvents.on('email', (player, newValue, oldValue) => {
    // Only called when the `email` property for a given player is changed
});
```
