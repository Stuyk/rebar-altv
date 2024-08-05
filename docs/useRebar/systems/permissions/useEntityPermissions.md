---
order: f
title: useEntityPermissions
---

# useEntityPermissions

This function allows you to easily integrate permission system into your feature.

It checks if player has a permission to perform an action on an entity, which type was extended from `PermissionOptions`.

```typescript
import { PermissionOptions } from '@Shared/types/index.js';

export interface MyEntity extends PermissionOptions {
    // your entity properties
}
```

This extends the entity with `permissions` property, this allows you to define complex permission structures, like:

`permissions` property accepts a string, an array of strings, or an object with `and` and `or` properties.

```typescript

const firstEntity: MyEntity = {
    permissions: 'myPermission',
}

const secondEntity: MyEntity = {
    permissions: ['myPermission', 'anotherPermission'],
}

const thirdEntity: MyEntity = {
    permissions: {
        and: ['myPermission', { or: ['anotherPermission', 'yetAnotherPermission'] }],
    },
}

```

## Checking permissions

This function allows you to check if player has a permission to perform an action on an entity.

It will search for a permission for both player's account and character.

```typescript
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

function hasPermission(player: alt.Player, entity: MyEntity): boolean {
    return Rebar.permissions.useEntityPermissions(entity).hasPermission(player);
}
```
