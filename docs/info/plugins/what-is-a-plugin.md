---
order: 100
---

# What is a Plugin?

A plugin can be seen as code that is meant to work with the Rebar Framework.

## Where are plugins stored?

Plugins can be found in the `src/plugins` directory, and each plugin should have a unique folder name.

## Example Plugin Structure

This plugin structure is used purely as a full featured plugin.

```
├───main
│   ├───client
│   ├───server
│   ├───shared
│   └───translate
└───plugins
    └───your-plugin
        ├───dependencies.json (alt: package.json)
        ├───client
        │   └───index.ts
        ├───fonts
        │   ├───arial.otf
        │   └───inter.ttf
        ├───images
        │   ├───somelogo.png
        │   └───bg.jpg
        ├───rmlui
        │   └───index.html (yes this actually html)
        │   └───font.ttf
        ├───server
        │   └───index.ts
        ├───sounds
        │   ├───alert_a.ogg
        │   └───alert_b.ogg
        ├───translate
        │   └───index.ts
        └───webview
            └───MyCustomPage.vue
```

See [plugin structure](./structure.md) for more information.

## Example Shared Vue Components / Composables Plugin

It is recommended to prefix your plugin with `ui` when it's components and composables

```
├───main
│   ├───client
│   ├───server
│   ├───shared
│   └───translate
└───plugins
    └───ui-your-plugin
        └───UiInput.vue
        └───UiButton.vue
```

## Disabling Plugins

If you wish to disable a plugin simply add a `!` before the folder name.

Alternatively you can add a file named `.disable` to the plugin folder to disable it.

## Adding Dependencies

If you noticed a plugin can use npm packages for the webview or server.

!!!
It is recommended to avoid using packages where possible to keep everything 'future proofed'
!!!

Simply add a `dependencies.json` or `package.json` to your plugin folder.

Add a section called `dependencies` and it will automatically install the dependencies the next time you run your server.

```json
{
    "dependencies": {
        "@formkit/auto-animate": "latest"
    }
}
```
