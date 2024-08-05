# Virtual Document

See [Documents Section](./index.md) for further information on documents.

## useVirtual

If document is not found in the database, it will return `undefined`.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

interface CustomDocument {
    _id: string;
    test1: string;
    test2: string;
}

const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>('663ce39eb270106cf02fb7e3', 'SomeCollection');
```

### get

Get all data for a document

```ts
async function someFunction() {
    const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    if (!virtualDocument) {
        return;
    }
    const data = virtualDocument.get();
    console.log(data);
}
```

### getField

Get a specific field from a document

```ts
async function someFunction() {
    const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    if (!virtualDocument) {
        return;
    }
    const test1 = virtualDocument.getField('test1');
    console.log(test1);
}
```

### set

Set a specific field for the document, and save to the database

```ts
async function someFunction() {
    const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    if (!virtualDocument) {
        return;
    }
    await virtualDocument.set('test1', 'hi');
}
```

### setBulk

Set multiple fields for the document, and save to the database

```ts
async function someFunction() {
    const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    if (!virtualDocument) {
        return;
    }
    await virtualDocument.setBulk({ test1: 'hi', test2: 'hi' });
}
```

### refresh

Refresh the document from the database

```ts
async function someFunction() {
    const virtualDocument = await Rebar.document.virtual.useVirtual<CustomDocument>(
        '663ce39eb270106cf02fb7e3',
        'SomeCollection',
    );
    if (!virtualDocument) {
        return;
    }
    await virtualDocument.refresh();
}
```

### [permissions](/userebar/systems/permissions/playerPermissions.md#usevirtual)

If you want to modify permissions for a document, you can use the `permissions` property.

It is available only for `Accounts` and `Characters` collections.

Click the link above(heading) to see more details on how to use this property.

### [groups](/userebar/systems/permissions/playerGroups.md#usevirtual)

If you want to modify groups for a document, you can use the `groups` property.

It is available only for `Accounts` and `Characters` collections.

Click the link above(heading) to see more details on how to use this property.
