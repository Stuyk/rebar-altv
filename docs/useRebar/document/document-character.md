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

### [permissions](/userebar/systems/permissions/playerPermissions.md#usecharacter)

Click on the link above to see how to use character permissions.

### [groups](/userebar/systems/permissions/playerGroups.md#usecharacter)

Click on the link above to see how to use character groups.

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
