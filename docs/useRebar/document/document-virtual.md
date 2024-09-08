# Virtual Document

See [Documents Section](./index.md) for further information on documents.

## useVirtual

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

interface CustomDocument {
    _id: string;
    test1: string;
    test2: string;
}

const virtualDocument = Rebar.document.virtual.useVirtual<CustomDocument>('663ce39eb270106cf02fb7e3', 'SomeCollection');
```

### get

Get all data for a document

```ts
async function someFunction() {
    const virtualDocument = Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    const data = await virtualDocument.get();
    console.log(data);
}
```

### getField

Get a specific field from a document

```ts
async function someFunction() {
    const virtualDocument = Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    const test1 = await virtualDocument.getField('test1');
    console.log(test1);
}
```

### set

Set a specific field for the document, and save to the database

```ts
async function someFunction() {
    const virtualDocument = Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );

    await virtualDocument.set('test1', 'hi');
}
```

### setBulk

Set multiple fields for the document, and save to the database

```ts
async function someFunction() {
    const virtualDocument = Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );

    await virtualDocument.setBulk({ test1: 'hi', test2: 'hi' });
}
```
