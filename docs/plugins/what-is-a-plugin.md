---
order: 100
---

# What is a Plugin?

A plugin can be seen as code that is meant to work with the Rebar Framework.

## Where are plugins stored?

Plugins can be found in the `src/plugins` directory, and each plugin should have a unique folder name.

## Example Plugin Structure

```
├───main
│   ├───client
│   ├───server
│   ├───shared
│   └───translate
└───plugins
    └───your-plugin
        ├───client
        │   └───index.ts
        ├───images
        │   ├───somelogo.png
        │   └───bg.jpg
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

See [create a plugin](./create.md) for more information.

## Disabling Plugins

If you wish to disable a plugin simply add a `!` before the folder name.

### Before

```
src/plugins/myplugin
```

### After

```
src/plugins/!myplugin
```
