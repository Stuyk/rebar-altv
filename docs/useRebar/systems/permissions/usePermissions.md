---
order: d
title: usePermissions
---

# usePermissions

This function allows you to easily check if a player has a permission. It is a wrapper around the `useAccount` and `useCharacter` functions, and it will automatically check the permissions for the player's character or account.

## Checking permissions

```typescript
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function hasPermission(player: alt.Player, permission: string): boolean {
  return Rebar.permissions.usePermissions(player).hasPermission(permission);
}
```

This will start from account permissions, then will check account groups' permissions, then character permissions, and finally character groups' permissions. If the permission is found at any level, it will return `true` immediately. If the permission is not found at any level, it will return `false`.

## Getting a flat permission list

```typescript
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function getPermissions(player: alt.Player): string[] {
  return Rebar.permissions.usePermissions(player).listAllPermissions();
}
```

This will return a flat list of all permissions that the player has.
Includes:
- Account permissions
- Account group permissions, including inherited groups
- Character permissions
- Character group permissions, including inherited groups

## Proxy functions

The `usePermissions` function also has proxy functions for `useAccount` and `useCharacter` permissions/groups functions.
This allows you to easily modify permissions and groups for the player's account or character.

```typescript
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function grantCharacterPermission(player: alt.Player, permission: string): void {
  Rebar.permissions.usePermissions(player).character.permissions.grant(permission);
}

function grantAccountPermission(player: alt.Player, permission: string): void {
  Rebar.permissions.usePermissions(player).account.permissions.grant(permission);
}
```

Follow these links to see more details on how to use these functions for groups and permissions:
- [permissions](/userebar/systems/permissions/playerPermissions.md)
- [groups](/userebar/systems/permissions/playerGroups.md)
