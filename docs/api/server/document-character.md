# Document - Character

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
import { useCharacter } from '@Server/document/account.js';

const document = useCharacter(player);

//...some function
const vehicles = await document.getVehicles();
if (vehicles.length >= 1) {
    console.log('They have some vehicles');
} else {
    console.log('They do not have a vehicle');
}
```
