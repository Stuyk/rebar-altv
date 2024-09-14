---
order: 950
templating: false # to be able to use {{ variable }} in example.
---

# useTranslate

Translation module for the client, server and webview.

## Usage

Before using the translation module, you need to initialize translations for the language you want to use.

This file should be located at `<your_plugin>/translate/index.ts`.

```ts <your_plugin>/translate/index.ts
import { useTranslate } from '@Shared/translate';

const { setBulk } = useTranslate();

setBulk({
    'en': {
        'test': 'This is a test',
        'test_with_variable': 'This is a test with a variable: {{ variable }}',
    },
    'de': {
        'test': 'Dies ist ein Test',
        'test_with_variable': 'Dies ist ein Test mit einer Variable: {{ variable }}',
    },
});
```

After that, you can use the `useTranslate` function to get the translation for the language you want to use.

!!!warning Important note
The file you just created should be imported in place you want to use translations.
!!!


```ts <your_plugin>/server/index.ts
import { useTranslate } from '@Shared/translate';
import '../translate'; // Import the translation file you created earlier.


const { t } = useTranslate('de');  // It is 'en' by default if no language is provided.

console.log(t('test'));
// Will log 'Dies ist ein Test'

console.log(t('test_with_variable', { variable: 'test' }));
// Will log 'Dies ist ein Test mit einer Variable: test'
```