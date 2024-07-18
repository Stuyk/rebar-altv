# Utility

Utility provides a lot of shared functionality between client, server, and webview.

!!!
Your import path may vary depending on where you're importing from.
!!!

## Import

```ts
import * as Utility from '@Shared/utility/index.js';
```

## Usage

### Clone Data

When you need to break function bindings for objects, or clone an array. This is a way to do it.

This works exactly the same as a deep clone.

```ts
const arrayResult = Utility.clone.arrayData([]);
const objectResult = Utility.clone.objectData({});
```

### RGBA to Hex

Some values from the natives return as `rgba`, this converts them to `hex`.

```ts
const hexColor = Utility.color.rgbaToHexAlpha(new alt.RGBA(0, 0, 0, 255));
```

### Missing Number

Return a missing number given a group of numbers.

```ts
// Result should be 2
const numberResult = Utility.math.getMissingNumber([0, 1, 3], 0);
```

### Randomization

Various randomization functions for creating data.

```ts
// Will pull a random result from the array
const elementResult = Utility.random.element<number>([0, 1, 2, 3, 4, 5]);

// Will pull a random number between two numbers
const rngNumberResult = Utility.random.numberBetween(0, 5);

// Will create a random color
const rngRgbResult = Utility.random.rgb();

// Will shuffle the numbers into a random order
const shuffledArray = Utility.random.shuffle<number>([0, 1, 2, 3, 4]);
```

### UID

Randomly generates a short string. Collision can happen.

```ts
const uid = Utility.uid.generate();
```

### Vector

Vectors are used to perform various distance checks.

```ts
// Only gets the distance between X & Y
const distShort = Utility.vector.distance2d(new alt.Vector3(0, 0, 0), new alt.Vector3(1, 1, 1));

// Only gets the distance between X, Y, & Z
const distLong = Utility.vector.distance(new alt.Vector3(0, 0, 0), new alt.Vector3(1, 1, 1));

// Returns a position in front of a given player, vehicle, etc.
const posInFrontOf = Utility.vector.getVectorInFrontOfPlayer(somePlayerOrVehicle, 5);
```

### Vehicle Hash Map

When you need vehicle names from hash values or need a large list of vehicles. This is it.

```ts
// will return 'infernus'
const model = Utility.vehicleHashes.getNameFromHash(418536135);

// Adding vehicles like this needs to be done from webview, server, and shared to be accurate
Utility.vehicleHashes.addVehicle('infernus');

// Returns a string array of vehicle model names
const vehicleModels = Utility.vehicleHashes.getVehicles();
```
