# Character

An character document is a set of data that is bound to the player until they disconnect.

It automatically saves data to the MongoDB database when any `set` function is used.

## Binding Data

You should bind character data after fetching call characters owned by an account.

```ts
import { useCharacter, useCharacterBinder } from '@Server/document/character.js';

// ... some function
// Use database functions to fetch or create a character
const someCharacterData = someDatabaseFetchOrCreateFunction();

// Bind character data to the player after fetching
const charBinder = useCharacterBinder(player);
charBinder.bind(someCharacterData);
```

## Getting Data

Data can be retrieved for the bound character like this.

```ts
import { useCharacter, useCharacterBinder } from '@Server/document/character.js';

//... some function
const character = useCharacter(player);
const document = character.get();
console.log(document.email);
```

## Setting Data

Data can easily be appended or set in two different ways.

```ts
import { useCharacter, useCharacterBinder } from '@Server/document/character.js';

const document = useCharacter(player);

type CustomCharacter = { whatever: string };

//...some function
// Single field
document.set('banned', true);

// Multi-field
document.setBulk({ name: 'John_Doe' });

// Custom-field
document.setBulk<CustomCharacter>({ whatever: 'hi' });
```

## Getting Vehicles

When you need to obtain a vehicle file for an character, you can use this function to get all existing vehicles owned by the player.

```ts
import { useCharacter } from '@Server/document/character.js';

const document = useCharacter(player);

//...some function
const vehicles = await document.getVehicles();
if (vehicles.length >= 1) {
    console.log('They have some vehicles');
} else {
    console.log('They do not have a vehicle');
}
```

## Permissions

Permissions for characters only allows the permission to exist on the one character it is assigned to.

Here's the simplest way to add, remove, and check permissions.

```ts
import { useCharacter } from '@Server/document/character.js';

// ...some function
const document = useCharacter(player);

await document.permission.addPermission('mechanic');
await document.permission.removePermission('mechanic');
const result = document.permission.hasPermission('mechanic');
```

## Permission Groups

Permission groups allow you to assign permissions under a specific group name for a character.

```ts
import { useCharacter } from '@Server/document/character.js';

//...some function
const document = useCharacter(player);

await document.permission.addGroupPerm('police', 'cadet');
await document.permission.removeGroupPerm('police', 'cadet');

// Check if they have a matching group permission
const result = document.permission.hasGroupPerm('police', 'cadet');

// Check if they have any matching group permission from the array
const result = document.permission.hasAnyGroupPermission('police', ['cadet', 'patrol']);
```
