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

## License

AGPL-2.0 License with Additional Clause

The Affero General Public License (AGPL) version 2.0, as published by the Free Software Foundation, with the following modification:

### AGPL-2.0 License:

    This program is free software: you can redistribute it and/or modify
    it under the terms of the Affero General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    Affero General Public License for more details.

    You should have received a copy of the Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

### Additional Clause: Commercial Sale of Plugins

    Notwithstanding any other provisions in this license, the use, distribution,
    and commercial sale of plugins or add-ons designed to interact with or extend
    the functionality of the software are permitted without restriction. Such plugins
    or add-ons may be sold, distributed, or used commercially under any license,
    including proprietary licenses, without requiring the release of source code.
