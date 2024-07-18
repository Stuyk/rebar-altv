# Native Menu

This is a faux version of the native menu. It's a custom implementation that has a much simpler API.

## Create

```ts
import * as alt from 'alt-client';
import { useNativeMenu } from '@Client/menus/native/index.js';

const menu = useNativeMenu({
    header: 'My Menu',
    noExit: false, // Prevent menu from exiting forcing it open if set to true
    backCallback: () => {}, // Call another function when backspace is pressed. Showing another menu, or something else.
    options: [
        {
            text: 'Invoke Event',
            type: 'invoke',
            value: 'any-value-you-want',
            callback: (value) => {
                alt.log(value);
            },
        },
        {
            text: 'My Selection Group',
            type: 'selection',
            callback: (value) => {
                alt.log(value);
            },
            index: 0,
            options: [
                {
                    text: 'afdsfdsfdsdsss',
                    value: 'a',
                },
                {
                    text: 'b',
                    value: 'b',
                },
            ],
        },
        {
            text: 'My Color Group',
            type: 'color',
            callback: (value) => {
                alt.log(value);
            },
            index: 0,
            options: [
                {
                    text: 'red',
                    color: new alt.RGBA(255, 0, 0, 255),
                    value: 0,
                },
                {
                    text: 'green',
                    color: new alt.RGBA(0, 255, 0, 255),
                    value: 1,
                },
            ],
        },
        {
            text: 'Input',
            type: 'input',
            callback: (value) => {
                alt.log(value);
            },
            value: 'initial value',
        },
    ],
});

menu.open();
```

## Destroy

```ts
menu.destroy();
```

## Nested Menus Example

This is a menu with two deeper level menus inside of it.

```ts
function openMain() {
    const menu = useNativeMenu({
        header: 'main Menu',
        noExit: false,
        options: [
            {
                text: 'Menu 1',
                type: 'invoke',
                value: '',
                callback: () => {
                    openOne(menu);
                },
            },
            {
                text: 'Menu 2',
                type: 'invoke',
                value: '',
                callback: () => {
                    openTwo(menu);
                },
            },
        ],
    });

    menu.open();
}

function openOne(prevMenu: ReturnType<typeof useNativeMenu>) {
    prevMenu.destroy();

    const menu = useNativeMenu({
        header: 'Menu One',
        backCallback: openMain,
        options: [
            {
                text: 'Invoke Event',
                type: 'invoke',
                value: '',
                callback: (value) => {
                    alt.log(value);
                },
            },
        ],
    });

    menu.open();
}

function openTwo(prevMenu: ReturnType<typeof useNativeMenu>) {
    prevMenu.destroy();

    const menu = useNativeMenu({
        header: 'Menu Two',
        backCallback: openMain,
        options: [
            {
                text: 'Invoke Event',
                type: 'invoke',
                value: '',
                callback: (value) => {
                    alt.log(value);
                },
            },
        ],
    });

    menu.open();
}

openMain();
```
