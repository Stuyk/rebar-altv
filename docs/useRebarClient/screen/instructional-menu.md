# Instructional Menu

Instructional menus are the keys that show up in the bottom right of the screen.

They usually use [Controls](https://altv.stuyk.com/docs/articles/tables/controls.html)

```ts
import { useInstructionalButtons } from '@Client/screen/instructionalButtons.js';

let instructionalButtons = useInstructionalButtons();

instructionalButtons.create([
    { text: 'Back / Exit', input: '~INPUT_FRONTEND_RRIGHT~' },
    { text: 'Enter', input: '~INPUT_FRONTEND_RDOWN~' },
    { text: 'Change', input: '~INPUTGROUP_CELLPHONE_NAVIGATE_LR~' },
    { text: 'Navigate', input: '~INPUTGROUP_CELLPHONE_NAVIGATE_UD~' },
]);
```
