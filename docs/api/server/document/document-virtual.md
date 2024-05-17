# Virtual

An virtual document lets you interface with a document by `_id` and `collection`.

All functions are `async` and reads data directly from the database.

Virtual documents just provide a similar approach to reading / writing data while coding.

## Usage

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

type CustomDocument = { test1: string; test2: string };

async function test() {
    // Requires the _id of a document, and the collection name
    const virtual = Rebar.document.virtual.useVirtual('663ce39eb270106cf02fb7e3', 'Characters');

    // Get the document data, and set the return type
    const someData = await virtual.get<CustomDocument>();
    console.log(someData);

    // Save data to the database
    await virtual.set<CustomDocument>('test1', 'hi');
    await virtual.setBulk<CustomDocument>({ test1: 'hi', test2: 'hi2' });

    // Get data from the database
    // Should be 'hi'
    const result = await virtual.getField<CustomDocument>('test1');
}
```
