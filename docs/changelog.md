---
order: -1000
---

# Changelog

## Version 5

### Code Changes

-   Added `isValid` to `character`, `account`, and `vehicle` documents to check if an entity has a bound document
-   Added `useStatus` to `player` API pathway to check for `account` and `character` status
-   Added `events` to the `Rebar` API
    -   Added on account bound
    -   Added on character bound
    -   Added on vehicle bound
    -   Added on message
-   Fixed small bug with case-sensitive commands
-   Fixed bug that allowed sending messages when a `character` was not bound

### Docs Changes

-   Added `isValid` examples to `character`, `account`, and `vehicle`.
-   Added `useStatus` to `player` section
-   Added `events` section to Server API

## Version 4

### Code Changes

-   Added `getCommands` to the `messenger` system
-   Added `formatTimestamp` to the shared utilities

## Version 3

### Code Changes

-   Added `focus` and `unfocus` support to client-side webviews

## Version 2

### Code Changes

-   Fixed issue with disabling plugins

## Version 1

### Code Changes

-   Added `package.json` or `dependency.json` support to plugins
-   Added an install pipeline for plugins that need specific npm packages
-   Added ability to disable a plugin by creating a file called `.disable` in the given plugin folder
-   Added `useMessenger` to server-side for processing user commands, and chat system (not console commands)
-   useMessenger also provides onMessage, sending messages, registering commands, and invoking commands
-   Added `useMessenger` composable to `webview` for `emitting` messages to the server for processing, automatically handles commands
    -   Additional note, messages are sent to the void and go nowhere until a chat plugin is added
    -   This is effectively a messenger middleware for building a chat or command system
-   Added `sendMessage` to the `useNotify` player composable

### Docs Changes

-   Added question about NPM packages to FAQ docs
-   Added `virtual` document type docs to the `API/Document` section
-   Updated what is a plugin, and create docs to clarify new changes
-   Updated `useNotify` docs for `sendMessage`
-   Added `useMessenger` docs for composable, and server-side
