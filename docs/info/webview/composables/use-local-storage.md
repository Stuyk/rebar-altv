# useLocalStorage

A way to store local data to the alt:V Client.

```ts
import { useLocalStorage } from '@Composables/useLocalStorage'

async function example() {
    const localStorage = useLocalStorage();
    
    // Set something into the local storage
    localStorage.set('myKey', 'someValue')

    // Get something from the local storage
    const result = await localStorage.get('myKey');
    console.log(`Local test result: ${result}`); // This will return `someValue`

    // Remove the data based on key
    await localStorage.remove('myKey');
}
```