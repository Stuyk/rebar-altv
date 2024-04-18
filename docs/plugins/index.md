# What is a Plugin?

A plugin can be seen as code that is meant to work with the Rebar Framework.

## Where are plugins stored?

Plugins can be found in the `src/plugins` directory, and each plugin should have a unique folder name.

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
