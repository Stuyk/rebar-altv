# Character Document

See [Documents Section](./index.md) for further information on documents.

## Extending Character

Extending the default Character Interface is super simple. Just add a `declare module` to any plugin.

```ts
declare module '@Shared/types/character.js' {
    export interface Character {
        newCoolData: string;
    }
}
```

## useCharacterBinder

### bind

```ts
// Use database functions to fetch or create an account
const someCharacterData = {
    _id: 'jklfdsjklfds',
    name: 'Person_Face',
    id: 4,
    armour: 0,
    health: 194,
};

// Bind account data to the player after fetching
const document = Rebar.document.character.useCharacterBinder(player).bind(someCharacterData);
```

---

## useCharacter

### isValid

If you need to check if a player has a document bound to them, you can use the following method.

```ts
function someFunction(player: alt.Player) {
    if (!Rebar.document.character.useCharacter(player).isValid()) {
        // No character bound
        return;
    }
}
```

### get

Get the entire document bound to the player.

```ts
function someFunction(player: alt.Player) {
    const character = Rebar.document.character.useCharacter(player);
    const document = character.get();
}
```

### getField

Get a specific field for the given document.

```ts
function someFunction(player: alt.Player) {
    const character = Rebar.document.character.useCharacter(player);
    const health = character.getField('health');
}
```

### getVehicles

Get all vehicle documents that are owned by this character.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const vehicles = await document.getVehicles();
    if (vehicles.length >= 1) {
        console.log('They have some vehicle documents');
    } else {
        console.log('They do not have any vehicle documents');
    }
}
```

### set

Set a single field to be stored in the database.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    document.set('banned', true);
}
```

### setBulk

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    document.setBulk({ name: 'New_Name!', health: 200 });
}
```

### permissions

You can grant/revoke permissions to the character and check if character has them.

#### addPermission

Grants a permission to the character.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    await document.permissions.addPermission('admin');
}
```

#### removePermission

Revokes permission from the character.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    await document.permissions.removePermission('admin');
}
```

#### hasPermission

Checks if character has a permission.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const hasPerm: boolean = document.permissions.hasPermission('admin');
}
```

#### hasAllPermissions

Checks if character has all of the provided permissions:

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const hasAllPerm: boolean = document.permissions.hasAllPermissions(['admin', 'support']);
}
```

#### hasAnyPermission

Checks if character has at least one of the provided permissions:

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const hasAnyPerm: boolean = document.permissions.hasAnyPermission(['admin', 'support']);
}
```

### groupPermissions

Permission groups allow you to assign permissions under a specific group name for an character.

#### addPermissions

Adds permission to specified group. If an character had no group before - it will create it.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    await document.groupPermissions.addPermissions('admin', 'noclip');
}
```

#### removePermissions

Removes permission from group, it will also remove a group, if there are no permissions left.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    await document.groupPermissions.removePermissions('admin', 'noclip');
}
```

#### removeGroup

Completely removes group from an character with all its permissions.

```ts
async function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    await document.groupPermissions.removeGroup('admin');
}
```

#### hasGroup

Checks if character belongs to group.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const isAdmin: boolean = document.groupPermissions.hasGroup('admin');
}
```

#### hasGroupPerm

Checks if character belongs to group and has a specific permission.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const canNoclip: boolean = document.groupPermissions.hasGroupPerm('admin', 'noclip');
}
```

#### hasAtLeastOneGroupPerm

Checks if character belongs to group and has any of provided permissions.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const canBanOrNoclip: boolean = document.groupPermissions.hasAtLeastOneGroupPerm('admin', ['noclip', 'ban']);
}
```

#### hasAtLeastOneGroupWithSpecificPerm

Checks if character belongs to any of the group and has corresponding rights.

```ts
function someFunction(player: alt.Player) {
    const document = Rebar.document.character.useCharacter(player);
    const isStaff = document.groupPermissions.hasAtLeastOneGroupWithSpecificPerm({
        admin: ['noclip', 'ban'],
        support: ['answerReport'],
    });
    // This will be true if:
    // 1. Character has `admin` group with `noclip` OR/AND `ban` permission.
    // 2. Character has `support` group with `answerReport` permission.
}
```

## useCharacterEvents

Listen for individual key changes for a given document.

Any field from the `character` document is valid.

### on

```ts
const CharacterEvents = Rebar.document.character.useCharacterEvents();

CharacterEvents.on('health', (player, newValue, oldValue) => {
    // Only called when the `health` property for a given player is changed
});
```
