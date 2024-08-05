---
order: 500
---

# utility

These are a collection of utility functions, some also exist client-side but most are server-side only.

## clone.arrayData

Cloning an array and ensuring it is not bound to anything

```ts
const oldArray = [1, 2, 3];
const newArray = Rebar.utility.clone.arrayData(oldArray);
```

## clone.objectData

Cloning object data will remove any functions

```ts
const oldObject = { hello: 'test', test: () => {} };
const newObject = Rebar.utility.clone.objectData(oldObject);
```

## clothing.addCategory

Add a new category with dlc information, for custom dlcs
These are the maximum ids available for each given set of clothes in the dlc based on component index.

```ts
//Rebar.utility.clothing.addCategory('dlc-name', { clothes: { 2: 5 }, props: {} });
```

## clothing.getCategories

Returns all available DLC names for female or male characters

```ts
const maleCategories = Rebar.utility.clothing.getCategories('male');
const femaleCategories = Rebar.utility.clothing.getCategories('female');
```

## clothing.getCategory

Return all data about a given dlc's clothes

```ts
const data = Rebar.utility.clothing.getCategory('Female_Apt01');
console.log(data.clothes);
```

## clothing.getDefaultCategory

Get the default game baked clothes

```ts
const maleBaseGameClothes = Rebar.utility.clothing.getDefaultCategory('male');
const femaleBaseGameClothes = Rebar.utility.clothing.getDefaultCategory('female');
```

## clothing.getTops

Get all available top data for a model, including torso category

```ts
const maleTops = Rebar.utility.clothing.getTops('male');
const femaleTops = Rebar.utility.clothing.getTops('male');
```

## clothing.getTorsos

Get all torsos available for a given clothing top

```ts
const torsosAvailable = Rebar.utility.clothing.getTorsos('male', maleTops[0].torsos);
```

## clothing.getUndershirts

Get all available undershirts for a given clothing top

```ts
const undershirtsAvailable = Rebar.utility.clothing.getUndershirts('male', maleTops[0].category);
```

## color.rgbaToHextAlpha

Converts an RGBA color to a hex color. This one returns #FF0000
Results always includes `#`

```ts
const hexColor = Rebar.utility.color.rgbaToHexAlpha(new alt.RGBA(255, 0, 0));
```

## flag.isEnabled

Bitwise flags are useful when you want to store a lot of options under a single variable

```ts
const Roles = {
    Player: 0,
    Moderator: 1,
    Admin: 2,
    SuperAdmin: 4,
    // Next entry is 8
    // Do not exceed 33 entries
};

const myRoles = Roles.Admin & Roles.Moderator & Roles.SuperAdmin;
const isSuperAdmin = Rebar.utility.flag.isEnabled(myRoles, Roles.SuperAdmin);
if (isSuperAdmin) {
    // Super Admin!
}
```

## math.getMissingNumber

Returns the missing number given an array of numbers

```ts
const missingNumber = Rebar.utility.math.getMissingNumber([0, 1, 3]);
```

## password.check

Checks a given password against a password hash
Uses pbkdf2

```ts
Rebar.utility.password.check('plainpassword', 'somecrazyhashvalue');
```

## password.hash

Hashes a password for safe database storage

```ts
const pbkdf2Password = Rebar.utility.password.hash('plainpassword');
```

## random.element

Will pull a random result from the array

```ts
const elementResult = Utility.random.element<number>([0, 1, 2, 3, 4, 5]);
```

## random.numberBetween

Will pull a random number between two numbers

```ts
const rngNumberResult = Utility.random.numberBetween(0, 5);
```

## random.rgb

Will create a random color

```ts
const rngRgbResult = Utility.random.rgb();
```

## random.shuffle

Will shuffle the numbers into a random order, and return the shuffled array
//

```ts
const shuffledArray = Utility.random.shuffle<number>([0, 1, 2, 3, 4]);
```

## time.formatTimestamp

Generates a useable timestamp with hour, minute, and second

```ts
const { hour, minute, second } = Rebar.utility.time.formatTimestamp(Date.now());
```

## uid.generate

Generates a random short string as an identifier

```ts
const uid = Rebar.utility.uid.generate();
```

## useProtectCallback

When you're using events, or you need callbacks to be fully protected and permissioned this utility functions provides a simple wrapper to check for permissions before the callback is executed.

This prevents unauthorized users from executing callbacks at the event level.

A simple, but easy way to add permissions when recieving client-side events, or other callbacks.

```ts
// Functions like a normal alt:V on-client callback, or normal function.
// Only requirement is that the first argument is a player.
function handleEvent(player: alt.Player, arg1: string, arg2: string) {
    //
}

alt.onClient(
    'protected-event',
    Rebar.utility.useProtectCallback(handleEvent, {
        // This checks if the account has a permission
        account: ['admin'],

        // This checks if a character has some other permission
        character: ['do-something'],

        // This checks if a player has a group permission
        group: {
            police: ['cadet'],
        },
    }),
);
```

## useRateLimitCallback

When you're using events, or you need callbacks to be protected by a rate limiter, this is a wrapper you can use.

This prevents player invoked functions from being called too frequently.

In fact, if a player calls them too much, they will be kicked.

```ts
function doSomething(player: alt.Player) {
    console.log('this will call normally');
}

// This prevents the callback from being invoked unless 5 seconds has passed
alt.onClient('something-that-happens', Rebar.utility.useRateLimitCallback(doSomething, 'some-unique-identifier', 5000));
```
