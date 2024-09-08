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

### permissions

You can grant/revoke permissions to the account and check if account has them.

#### addPermission

Grants a permission to the account.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    await document.permissions.addPermission('admin');
}
```

#### removePermission

Revokes permission from the account.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    await document.permissions.removePermission('admin');
}
```

#### hasPermission

Checks if account has a permission.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const hasPerm: boolean = document.permissions.hasPermission('admin');
}
```

#### hasAllPermissions

Checks if account has all of the provided permissions:

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const hasAllPerm: boolean = document.permissions.hasAllPermissions(['admin', 'support']);
}
```

#### hasAnyPermission

Checks if account has at least one of the provided permissions:

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const hasAnyPerm: boolean = document.permissions.hasAnyPermission(['admin', 'support']);
}
```

### groupPermissions

Permission groups allow you to assign permissions under a specific group name for an account.

#### addPermissions

Adds permission to specified group. If an account had no group before - it will create it.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    await document.groupPermissions.addPermissions('admin', 'noclip');
}
```

#### removePermissions

Removes permission from group, it will also remove a group, if there are no permissions left.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    await document.groupPermissions.removePermissions('admin', 'noclip');
}
```

#### removeGroup

Completely removes group from an account with all its permissions.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    await document.groupPermissions.removeGroup('admin');
}
```

#### hasGroup

Checks if account belongs to group.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const isAdmin: boolean = document.groupPermissions.hasGroup('admin');
}
```

#### hasGroupPerm

Checks if account belongs to group and has a specific permission.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const canNoclip: boolean = document.groupPermissions.hasGroupPerm('admin', 'noclip');
}
```

#### hasAtLeastOneGroupPerm

Checks if account belongs to group and has any of provided permissions.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const canBanOrNoclip: boolean = document.groupPermissions.hasAtLeastOneGroupPerm('admin', ['noclip', 'ban']);
}
```

#### hasAtLeastOneGroupWithSpecificPerm

Checks if account belongs to any of the group and has corresponding rights.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.account.useAccount(player);
    const isStaff = document.groupPermissions.hasAtLeastOneGroupWithSpecificPerm({
        admin: ['noclip', 'ban'],
        support: ['answerReport'],
    });
    // This will be true if:
    // 1. Account has `admin` group with `noclip` OR/AND `ban` permission.
    // 2. Account has `support` group with `answerReport` permission.
}
```

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
