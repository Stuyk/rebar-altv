---
title: Player permissions
order: b
---

# Managing player permissions

To manage player permissions, Rebar exposes the same interface for both account and character permissions.

### Grant permission [!badge Async]

To grant a permission to a player, you can use one of the `grant` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function allowBan(player: alt.Player) {
    const granted = await Rebar.document.character.useCharacter(player).permissions.grant('ban');
    if (!granted) {
        console.log('Permission was already granted.');
    } else {
        console.log('Permission was granted.');
    }
}

```
!!!info Event will be triggered
This will trigger a `rebar:permissions:grant` event with following arguments:
- `player: alt.Player` — player that permissions was granted to.
- `permission: string` — permission that was granted.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function allowBan(player: alt.Player) {
    const granted = await Rebar.document.account.useAccount(player).permissions.grant('ban');
    if (!granted) {
        console.log('Permission was already granted.');
    } else {
        console.log('Permission was granted.');
    }
}

```
!!!info Event will be triggered
This will trigger a `rebar:permissions:grant` event with following arguments:
- `player: alt.Player` — player that permissions was granted to.
- `permission: string` — permission that was granted.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useVirtual

!!!warning For offline players only
This method is intended to be used for offline players only. If you want to grant a permission to a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.
!!!

```typescript #7,9
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function allowBan(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const granted = await document.permissions.grant('ban');
        if (!granted) {
            console.log('Permission was already granted.');
        } else {
            console.log('Permission was granted.');
        }
    } else {
        console.log('Account not found.');
    }
}

```
!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!
+++

### Revoke permission [!badge Async]

To revoke a permission from a player, you can use one of the `revoke` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function disallowBan(player: alt.Player) {
    const revoked = await Rebar.document.character.useCharacter(player).permissions.revoke('ban');
    if (!revoked) {
        console.log('Permission was already revoked.');
    } else {
        console.log('Permission was revoked.');
    }
}

```
!!!info Event will be triggered
This will trigger a `rebar:permissions:revoke` event with following arguments:
- `player: alt.Player` — player that permissions was revoked from.
- `permission: string` — permission that was revoked.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function disallowBan(player: alt.Player) {
    const revoked = await Rebar.document.account.useAccount(player).permissions.revoke('ban');
    if (!revoked) {
        console.log('Permission was already revoked.');
    } else {
        console.log('Permission was revoked.');
    }
}

```

!!!info Event will be triggered
This will trigger a `rebar:permissions:revoke` event with following arguments:
- `player: alt.Player` — player that permissions was revoked from.
- `permission: string` — permission that was revoked.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useVirtual

!!!warning For offline players only
This method is intended to be used for offline players only. If you want to revoke a permission from a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.
!!!

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const {CollectionNames} = Rebar.database;

async function disallowBan(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const revoked = await document.permissions.revoke('ban');
        if (!revoked) {
            console.log('Permission was already revoked.');
        } else {
            console.log('Permission was revoked.');
        }
    } else {
        console.log('Account not found.');
    }
}

```
!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!
+++

### Clear permissions [!badge Async]

To clear all permissions from a player, you can use one of the `clear` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function clearPermissions(player: alt.Player) {
    await Rebar.document.character.useCharacter(player).permissions.clear();
    console.log('Permissions were cleared.');
}
```
!!!info Event will be triggered
This will trigger a `rebar:permissions:clear` event with following arguments:
- `player: alt.Player` — player that permissions were cleared from.
- `permissions: string[]` — permissions that were cleared.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function clearPermissions(player: alt.Player) {
    await Rebar.document.account.useAccount(player).permissions.clear();
    console.log('Permissions were cleared.');
}
```

!!!info Event will be triggered
This will trigger a `rebar:permissions:clear` event with following arguments:
- `player: alt.Player` — player that permissions were cleared from.
- `permissions: string[]` — permissions that were cleared.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useVirtual

!!!warning For offline players only
This method is intended to be used for offline players only. If you want to clear permissions from a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.
!!!

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function clearPermissions(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        await document.permissions.clear();
        console.log('Account permissions were cleared.');
    } else {
        console.log('Account not found.');
    }
}
```
!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!
+++

### List permissions

To list all permissions granted to a player, you can use one of the `list` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function listPermissions(player: alt.Player) {
    const permissions = Rebar.document.character.useCharacter(player).permissions.list();
    console.log('Permissions:', permissions);
}
```

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function listPermissions(player: alt.Player) {
    const permissions = Rebar.document.account.useAccount(player).permissions.list();
    console.log('Permissions:', permissions);
}
```

+++ useVirtual

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function listPermissions(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const permissions = document.permissions.list();
        console.log('Permissions:', permissions);
    } else {
        console.log('Account not found.');
    }
}
```
+++

### Check specific permission

To check if a player has a specific permission, you can use one of the `has` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasBanPermission(player: alt.Player) {
    const hasPermission = await Rebar.document.character.useCharacter(player).permissions.has('ban');
    console.log('Has permission:', hasPermission);
}
```

+++ useAccount

```typescript #6

import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasBanPermission(player: alt.Player) {
    const hasPermission = await Rebar.document.account.useAccount(player).permissions.has('ban');
    console.log('Has permission:', hasPermission);
}
```

+++ useVirtual

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function hasBanPermission(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const hasPermission = await document.permissions.has('ban');
        console.log('Has permission:', hasPermission);
    } else {
        console.log('Account not found.');
    }
}
```
+++

### Check all permissions

To check if player has all of the specified permissions, you can use one of the `hasAll` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasAllPermissions(player: alt.Player) {
    const hasPermissions: boolean = await Rebar.document.character.useCharacter(player).permissions.hasAll(['ban', 'kick']);
    console.log('Has all permissions:', hasPermissions);
}
```

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasAllPermissions(player: alt.Player) {
    const hasPermissions: boolean = await Rebar.document.account.useAccount(player).permissions.hasAll(['ban', 'kick']);
    console.log('Has all permissions:', hasPermissions);
}
```

+++ useVirtual

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function hasAllPermissions(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const hasPermissions: boolean = await document.permissions.hasAll(['ban', 'kick']);
        console.log('Has all permissions:', hasPermissions);
    } else {
        console.log('Account not found.');
    }
}
```
+++

### Check any permission

To check if player has at least one of the specified permissions, you can use one of the `hasAny` methods.

+++ useCharacter

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasAnyPermission(player: alt.Player) {
    const hasPermissions: boolean = await Rebar.document.character.useCharacter(player).permissions.hasAnyOf(['ban', 'kick']);
    console.log('Has any permission:', hasPermissions);
}
```

+++ useAccount

```typescript #6
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function hasAnyPermission(player: alt.Player) {
    const hasPermissions: boolean = await Rebar.document.account.useAccount(player).permissions.hasAnyOf(['ban', 'kick']);
    console.log('Has any permission:', hasPermissions);
}
```

+++ useVirtual

```typescript #7,9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function hasAnyPermission(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        const hasPermissions: boolean = await document.permissions.hasAnyOf(['ban', 'kick']);
        console.log('Has any permission:', hasPermissions);
    } else {
        console.log('Account not found.');
    }
}
```
+++

