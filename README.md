# Rebar for alt:V

Rebar is a TypeScript framework for [alt:V](https://altv.mp) that prioritizes plugins, translations. Rebar was inspired by Athena and meant to take Athena's best features and create a framework that gives developers a quick starting point.

Plugins for Rebar allow developers to drag & drop repositories into their server framework.

### [Read our Docs!](https://rebarv.com)

### [Join our Discord!](https://discord.gg/63rrbadsR7)

## Features

-   TypeScript
-   Plugins
-   Locale / Translation Support
-   Path Aliasing
-   Transpiling
-   Reload
-   Webview Overlays, Persistent Pages, and Single Pages
-   Vue 3
-   TailwindCSS

## Where to find Plugins?

If you're looking for plugins for Rebar, check out these two websites.

-   https://github.com/Stuyk/awesome-rebar
-   https://forge.plebmasters.de/hub/Script

## Requirements & Usage

See [Install Instructions](https://rebarv.com/install/) for quick installation

## Structure

A folder structure that is simple to read, and simple to write.

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
        ├───server
        │   └───index.ts
        ├───translate
        │   └───index.ts
        └───webview
            └───MyCustomPage.vue
```

## Documentation

[https://rebarv.com](https://rebarv.com)

If you wish to run documentation locally, you can do the following:

```sh
pnpm install retypeapp --global
```

```
retype start ./docs
```
