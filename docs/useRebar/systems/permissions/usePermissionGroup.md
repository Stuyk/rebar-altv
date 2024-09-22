---
order: e
title: usePermissionGroup
---

# usePermissionGroup

Permission groups are a way to organize permissions into groups, and then assign those groups to players. This way, you can easily manage permissions for multiple players at once.

## Creating a permission group

You can create a permission group with these properties:
- `permissions: string[]` - an array of permission names that this group should have.
- `inherits?: string` - a name of a group that this group should inherit permissions from. This way, you can create a hierarchy of groups.
- `version?: number` - a version of the group.

`inherits` is a way to create a hierarchy of groups. If a group inherits from another group, it will have all the permissions from the inherited group.

Version is used to track changes in the group. On server start, the server is loading all groups from the database and comparing them with the groups in the code.

Conditions when the group will be updated in the database:
- The same group in the code and group in the database have **no** version property.
- Group in the code has version that is **greater than** the group in the database.

```typescript
import { useRebar } from '@Server/index.js';
const groups = Rebar.permissions.usePermissionGroup();

await groups.add('support', {
    permissions: ['kick', 'adminChat', 'mute'],
    version: 1,
});

await groups.add('admin', {
    permissions: ['ban', 'unban'],
    inherits: 'support',
});

await groups.add('chief', {
    permissions: ['grant', 'revoke'],
    inherits: 'admin',
});
```

In this example, we created three groups: `support`, `admin`, and `chief`. 
- The `support` group has three permissions: `kick`, `adminChat`, and `mute`. 
- The `admin` group has two permissions: `ban` and `unban`, and inherits all permissions from the `support` group. 
- The `chief` group has two permissions: `grant` and `revoke`, and inherits all permissions from the `admin` group, which in turn inherits all permissions from the `support` group.

## Removing a permission group

You can remove a permission group by calling the `remove` method with the name of the group you want to remove.

```typescript
import { useRebar } from '@Server/index.js';

const groups = Rebar.permissions.usePermissionGroup();

await groups.remove('support');
```

If groups exists, it will remove the `support` group from the database.

!!!info
On success, this will remove this group from all players(online/offline) that have this group attached.
!!!

## Add permissions to a group

You can add permissions to a group by calling the `addPermission` method with the name of the group and the permission you want to add.

```typescript
import { useRebar } from '@Server/index.js';

const groups = Rebar.permissions.usePermissionGroup();

await groups.addPermission('support', 'teleport');
```

This will add the `teleport` permission to the `support` group.

!!!info
On success, this will increment the version of the group and update this group in the database.
So, on next server start, if you want to make changes to the group, you need to increment the version of the group in the code.
!!!

## Remove permissions from a group

You can remove permissions from a group by calling the `removePermission` method with the name of the group and the permission you want to remove.

```typescript
import { useRebar } from '@Server/index.js';

const groups = Rebar.permissions.usePermissionGroup();

await groups.removePermission('support', 'teleport');
```

This will remove the `teleport` permission from the `support` group.

!!!info
On success, this will increment the version of the group and update this group in the database.
So, on next server start, if you want to make changes to the group, you need to increment the version of the group in the code.
!!!

## Check permission

You can check if group has a permission by calling the `groupHasPermission` method with the name of the group and the permission you want to check.

```typescript
import { useRebar } from '@Server/index.js';

const groups = Rebar.permissions.usePermissionGroup();

const hasPermission = await groups.groupHasPermission('support', 'teleport');
```

This will return `true` if the `support` group has the `teleport` permission, otherwise `false`.

## List Permissions

You can list all permissions recursively for a group by calling the `groupsToPlainPermissions` method with the name of the group.

```typescript
import { useRebar } from '@Server/index.js';

const groups = Rebar.permissions.usePermissionGroup();

const permissions = await groups.groupsToPlainPermissions('chief');
```

This will return an array of all permissions for the `chief` group, including all inherited permissions.
So, according to the `add` example, this will return `['kick', 'adminChat', 'mute', 'ban', 'unban', 'grant', 'revoke']`.
