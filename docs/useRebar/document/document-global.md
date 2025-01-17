# Global Document

See [Documents Section](./index.md) for further information on documents.

## useGlobal

When creating a global document, it will always come with an identifier.

You should also specify a data type for your global document.

```ts
type MyDataType = {
    _id: string;
    identifier: string;
    totalMoneyCreated: number;
    totalMoneyDestroyed: number;
};

async function someFunction() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-cool-global-document');
}
```

### get

Get the entire document of data.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');
    const data = document.get();
    console.log(data);
}
```

### getField

Get a specific field from the document. These may return `undefined`.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');

    const totalMoneyCreated = document.getField('totalMoneyCreated');
    console.log(totalMoneyCreated);
}
```

### set

Set a specific field for the document.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');
    document.set('totalMoneyCreated', 200);
}
```

### setBulk

Set multiple fields for the document.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');
    document.setBulk({ totalMoneyCreated: 200, totalMoneyDestroyed: 200 });
}
```


### unset

Delete a specific field from the document.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');
    document.unset('totalMoneyCreated');
}
```

### increment

Increment a specific field by a specific amount. It uses 1 as default amount.

```ts
async function doSomething() {
    const document = await Rebar.document.global.useGlobal<MyDataType>('my-identifier-goes-here-for-my-document');
    document.increment('totalMoneyCreated'); // Increment by 1
    document.increment('totalMoneyCreated', 200); // Increment by 200
}
```
