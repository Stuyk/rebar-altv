---
order: c
title: Player groups
---

# Managing player groups

Player groups are a way to organize players into groups, and then assign permissions to those groups. This way, you can easily manage permissions for multiple players at once.

## Attaching player to a group [!badge Async]

To attach a player to a group, you can use the `useAccount`, `useCharacter` and `useVirtual` functions. All of them have a `groups` property that you can use to attach a player to a group.

+++ useCharacter
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function makeAdmin(player: alt.Player) {
  const character = Rebar.document.character.useCharacter(player);
  await character.groups.add('admin');
}

```
!!!info Event will be triggered
This will trigger a `rebar:permissions:groups:add` event with following arguments:
- `player: alt.Player` — player that group was added to.
- `group: string` — group that was added to character.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function makeAdmin(player: alt.Player) {
  const account = Rebar.document.account.useAccount('account-id');
  await account.groups.add('admin');
}
```
!!!info Event will be triggered
This will trigger a `rebar:permissions:groups:add` event with following arguments:
- `player: alt.Player` — player that group was added to.
- `group: string` — group that was added to account.
- `target: 'character' | 'account'` — target of the operation.
!!!
+++ useVirtual

!!!warning For offline players only
This method is intended to be used for offline players only. If you want to grant a permission to a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.
!!!

```typescript #9
import {useRebar} from '@Server/index.js';

const Rebar = useRebar();
const {CollectionNames} = Rebar.database;

async function makeAdmin(_id: string) {
    const document = await Rebar.document.virtual.useVirtual(_id, CollectionNames.Accounts);
    if (document) {
        await virtual.groups.add('admin');
    }
}
```
!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!
+++

## Removing player from a group [!badge Async]

To remove a player from a group, you can use the `useAccount`, `useCharacter` and `useVirtual` functions. All of them have a `groups` property that you can use to remove a player from a group.

+++ useCharacter
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function removeAdmin(player: alt.Player) {
  const character = Rebar.document.character.useCharacter(player);
  await character.groups.remove('admin');
}
```

!!!info Event will be triggered
This will trigger a `rebar:permissions:groups:remove` event with following arguments:
- `player: alt.Player` — player that group was removed from.
- `group: string` — group that was removed from character.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function removeAdmin(player: alt.Player) {
  const account = Rebar.document.account.useAccount('account-id');
  await account.groups.remove('admin');
}
```

!!!info Event will be triggered
This will trigger a `rebar:permissions:groups:remove` event with following arguments:
- `player: alt.Player` — player that group was removed from.
- `group: string` — group that was removed from account.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useVirtual

!!!warning For offline players only
This method is intended to be used for offline players only. If you want to grant a permission to a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.
!!!

```typescript #9
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function removeAdmin(_id: string) {
  const document = await Rebar.document.useVirtual(_id, CollectionNames.Accounts);
  if (document) {
      await virtual.groups.remove('admin');
  }
}
```

!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!

+++

## Clearing all groups [!badge Async]

To clear all groups from a player, you can use the `useAccount`, `useCharacter` and `useVirtual` functions. All of them have a `groups` property that you can use to clear all groups from a player.

+++ useCharacter
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function clearGroups(player: alt.Player) {
  const character = Rebar.document.character.useCharacter(player);
  await character.groups.clear();
}
```

!!!info Event will be triggered

This will trigger a `rebar:permissions:groups:clear` event with following arguments:
- `player: alt.Player` — player that groups were cleared from.
- `groups: string[]` — groups that were cleared from character.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useAccount
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function clearGroups(player: alt.Player) {
  const account = Rebar.document.account.useAccount('account-id');
  await account.groups.clear();
}
```

!!!info Event will be triggered

This will trigger a `rebar:permissions:groups:clear` event with following arguments:
- `player: alt.Player` — player that groups were cleared from.
- `groups: string[]` — groups that were cleared from account.
- `target: 'character' | 'account'` — target of the operation.
!!!

+++ useVirtual

!!!warning For offline players only

This method is intended to be used for offline players only. If you want to grant a permission to a player that is currently online, use `useCharacter` or `useAccount` permissions proxies.

!!!

```typescript #9
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function clearGroups(_id: string) {
  const document = await Rebar.document.useVirtual(_id, CollectionNames.Accounts);
  if (document) {
      await virtual.groups.clear();
  }
}
```

!!!warning Event won't be triggered
Unlike the `useCharacter` and `useAccount` permissions proxies, the `useVirtual` permissions proxy won't trigger any events.
!!!

+++

## Getting a list of groups

To get a list of groups that a player is in, you can use the `useAccount`, `useCharacter` and `useVirtual` functions. All of them have a `groups` property that you can use to get a list of groups.

+++ useCharacter
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function getGroups(player: alt.Player) {
  const character = Rebar.document.character.useCharacter(player);
  return character.groups.get();
}
```

+++ useAccount
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function getGroups(player: alt.Player) {
  const account = Rebar.document.account.useAccount('account-id');
  return account.groups.get();
}
```

+++ useVirtual

```typescript #9
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function getGroups(_id: string) {
  const document = await Rebar.document.useVirtual(_id, CollectionNames.Accounts);
  if (document) {
      return virtual.groups.get();
  }
  return undefined;
}
```

+++

## Check group membership

To check if a player is a member of a group, you can use the `useAccount`, `useCharacter` and `useVirtual` functions. All of them have a `groups` property that you can use to check if a player is a member of a group.

+++ useCharacter
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function isMemberOfAdminGroup(player: alt.Player) {
  const character = Rebar.document.character.useCharacter(player);
  return character.groups.memberOf('admin');
}
```

+++ useAccount
```typescript #7
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function isMemberOfAdminGroup(player: alt.Player) {
  const account = Rebar.document.account.useAccount('account-id');
  return account.groups.memberOf('admin');
}
```

+++ useVirtual

```typescript #9
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const { CollectionNames } = Rebar.database;

async function isMemberOfAdminGroup(_id: string) {
  const document = await Rebar.document.useVirtual(_id, CollectionNames.Accounts);
  if (document) {
      return virtual.groups.memberOf('admin');
  }
  return false;
}
```

+++
