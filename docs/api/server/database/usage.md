# Usage

When using the database in Rebar it can be accessed from any plugin.

However, the database may only be accessed on **server-side**.

!!!
Use the Document system if you are updating characters, accounts, or vehicles.
!!!

## Usage

Import the database into your plugin file, and begin using it.

```ts
import { useDatabase } from '@Server/database/index.js';

const { get, create, getAll, getMany, update, deleteDocument } = useDatabase();
```

### Create Data

Creating data uses the `create` function and returns an `_id` to obtain the data.

```ts
async function test() {
    const _id = await create({ name: 'Stuyk', age: 30 }, 'person');
}
```

### Get Data

If you want to get a document by an `_id`, you can use this:

```ts
async function test() {
    const _id = await create({ name: 'Stuyk', age: 30 }, 'person');
    const user = await get<{ name: string }>(_id);
    if (!user) {
        console.warn('Could not find the data!');
        return;
    }

    console.warn(`Found ${user.name}`);
}
```

### Find Data

After creating data, if you don't have an `_id` and you want to find it. You can use `getMany`.

```ts
async function test() {
    const results = await getMany<{ name: string }>({ name: 'Stuyk' }, 'person');
    if (results.length <= 0) {
        console.warn('Could not find the data!');
        return;
    }

    const user = results[0];
    console.warn(`Found ${user.name}`);
}
```

### Get All Data

It is not recommended to fetch a whole collection unless it's a smaller collection.

In any case, you can use this to fetch a whole collection of data.

```ts
async function test() {
    const results = await getAll<{ name: string }>('person');
}
```

### Update

If you want to update a document, or simply append new data to the document.

```ts
async function test() {
    const _id = await create({ name: 'Stuyk', age: 30 }, 'person');
    const didUpdate = await update({ _id, name: 'NotStuyk' }, 'person');
    if (!didUpdate) {
        return;
    }
}
```
