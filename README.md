# Zulthu for alt:V

Zulthu is a TypeScript framework for [alt:V](https://altv.mp) that prioritizes plugins, translations, and a wide variety of frontend frameworks. Zulthu was inspired by Athena and meant to take Athena's best features and create a framework that gives developers a quick starting point.

Plugins for Zulthu allow developers to drag & drop repositories into their server framework.

## Features

- TypeScript
- Plugins
- Locale / Translation Support
- Path Aliasing
- Transpiling
- Reload

## Usage

```sh
pnpm i
```

```sh
pnpm binaries
```

```sh
pnpm start
```

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
