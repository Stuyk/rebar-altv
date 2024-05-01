# Global

Global documents work a bit different than the other documents.

They are the only `async` document, and for good reason.

## Create a Document

When creating a global document, it will always come with an identifier.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Automatically creates the document, and stores it into the database
async function doSomething() {
    const document = await Rebar.document.global.useGlobal('my-identifier-goes-here-for-my-document');
}
```

## Getting Data

```ts
type MyDataType = {
    _id: string;
    identifier: string;
    totalMoneyCreated: number;
    totalMoneyDestroyed: number;
};

async function doSomething() {
    const document = await Rebar.document.global.useGlobal('my-identifier-goes-here-for-my-document');

    // Get the entire document
    const data = document.get<MyDataType>();
    console.log(data.totalMoneyCreated);

    // Get a single field
    const totalMoneyCreated = document.getField('totalMoneyCreated');
}
```

## Storing Data

Storing data can take any data type and store it for you.

Below is just a simple numerical example.

```ts
type MyDataType = {
    _id: string;
    identifier: string;
    totalMoneyCreated: number;
    totalMoneyDestroyed: number;
};

async function doSomething() {
    const document = await Rebar.document.global.useGlobal('my-identifier-goes-here-for-my-document');

    // Overwrite or set a single field
    document.setField<MyDataType>('totalMoneyCreated', 200);

    // Overwrite multiple fields
    document.setField<MyDataType>({ totalMoneyCreated: 200, totalMoneyDestroyed: 200 });
}
```
