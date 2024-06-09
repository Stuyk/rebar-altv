# Changelog

## Version 20

### Code Changes

-   Made `raycast.getFocusedObject()` return `entityPos`
-   Clearly warn users using `api.get` for obtaining an API, and recommend async instead
-   Added new `getMeta` API for getting plugin API as single import
-   Added `debug` option to `raycast` functions to draw lines when a raycast is invoked
-   Added `useServerConfig` to change what HUD elements, and other on screen elements a player sees

### Docs Changes

-   Added `debug` to raycast docs
-   Removed `get` from Plugin API examples, to let users focus on `async` instead
-   Added `useServerConfig` to docs

---

## Version 19

### Code Changes

-   Added reverse map for vehicle model hash to vehicle model name
-   Added function to add named models to list at runtime as well
-   Added neon synchronization to vehicle document sync

### Docs Changes

-   Added vehicleHashes utility doc info

---

## Version 18

### Code Changes

-   Fixed a bug where closest entity and target ids matched, when they were different types
-   Fixed passing `message` on client-side for interaction onEnter callbacks
-   Fixed character permission issues when using protected callbacks
-   Added group permissions for protected callbacks
-   Added `useProxyFetch` which allows for you to register safe endpoints on server-side which can be called client-side.
    -   This effectively allows you to make requests from the server to safely get results.
    -   Meaning that if you have an API which only allows your server to make requests, this is a way to invoke it safely.
-   Added `useRaycast` to get entity aimed at from client-side and return it to the server
    -   Can obtain position looking at
    -   Can obtain player, vehicle, or alt.Object looked at
    -   Can obtain model & position of world object looked at
-   Added `useVehicle` enhancements
    -   Functions that toggled asPlayer verify ownership of keys, permission, or owner itself of the vehicle
    -   bind
    -   toggleDoor
    -   toggleDoorAsPlayer
    -   toggleEngine
    -   toggleEngineAsPlayer
    -   toggleLock
    -   toggleLockAsPlayer
    -   keys: add, remove, clear
    -   isBound
        -   Check if the vehicle is already bound
    -   verifyOwner
        -   Check if the player is an 'owner' of the vehicle
        -   Additionally, optional section to check if they are the sole owner of the vehicle
-   Added new controller `usePed` which creates a global pedestrian which can have synced natives invoked on it
    -   It's recommended not to spawn more than 32 given peds around a single player.
    -   Can even easily listen to when the specific ped spawned dies

### Docs Changes

-   Added `useProxyFetch` doc
-   Added `useRaycast` doc
-   Added `useVehicle` updates
-   Added `usePed` controller docs

---

## Version 17

### Code Changes

-   Added `alt.getMeta('Rebar')` to get Server API with one-less import
-   Added `alt.getMeta('RebarClient')` to get Client API with one-less import
-   Fixed character interface not being extended correctly
-   Added `preinstall` script to download binaries, and build codebase once

### Docs Changes

-   Covered alternative API import methods in docs

---

## Version 16

### Code Changes

-   Added `@Composables` path alias
-   Added `@Plugins` path alias

### Docs Changes

-   Updated composables with `@Composables`
-   Updated `what is a plugin` with information about component / composable only plugins

## Version 15

### Code Changes

-   Update dependencies
-   Update `_id` in database functions to use a non-deprecated ObjectId handler
-   Added `useServerWeather` function to allow setting weather and weather forecast
    -   This does not automatically sync for players, it's just a global way to set the data

### Docs Changes

-   Added `useServerWeather` docs

---

## Version 14

### Code Changes

-   Added `emitServerRpc` to Webview to retrieve data from server-side using normal `alt.onRpc` events.
    -   Yes, this means you don't have to do weird event bindings to get data now.
-   Added `emitClientRpc` to Webview to retrieve data from client-side.

### Docs Changes

-   Added `emitServerRpc` and `emitClientRpc` to docs

---

## Version 13

### Code Changes

-   Updated `upgrade` script to prevent overwriting tailwind config, or vite config
-   Added `useLocalStorage` composable for getting / storing data

### Docs Changes

-   Added `useLocalStorage` composable docs

---

## Version 12

### Code Changes

-   Completely redid the compile pipeline
-   Improved compile times, and added docker build support to package.json scripts
-   Fixed linux based errors

### Docs Changes

-   Added install instructions for Linux
-   Added install instructions for Docker

---

## Version 11

### Code Changes

-   Added `createCollection` to database functions
-   Automatically create default collections on startup
-   Added `rebar:upgrade` script to get the latest code changes for Rebar

### Docs Changes

-   Added `createCollection` function to the database functions
-   Clarified how no spawner exists outright for Rebar
-   Added documentation about upgrading

---

## Version 10

### Code Changes

-   Added `ignore` and `autogen` as a keyword to ignore file changes when developing
-   Added `time-changed`, `time-second-changed`, `time-minute-changed`, and `time-hour-changed` events to core events
-   Added `useServerTime` setters / getters for managing server time more effectively
    -   Note: This does not auto-sync on players, other plugins can build more complex time systems

### Docs Changes

-   Added `useServerTime` API docs
-   Added `time-changed`, `time-second-changed`, `time-minute-changed`, and `time-hour-changed` event documentation

---

## Version 9

### Code Changes

-   Added client-side `messenger` for handling chat focus states
-   Patched issue where pressing `E` while chat is focused invoked interactions
-   Patched issue where pressing native menu buttons while chatting invoked native menu functions

---

## Version 8

### Code Changes

-   Fixed various `get closest` functions for `player` and `vehicle` getters
-   Added `useWaypoint` to get a waypoint a player has on their map if available
-   Added `usePlayer` function that combines all `useX` functions for player
-   Added `Rebar.utility.useProtectCallback` which adds permissions to callbacks before they are executed
    -   A simple way to protect alt:V client event callbacks

### Docs Changes

-   Added `useWaypoint` docs
-   Added `usePlayer` docs
-   Added `useProtectCallback` docs

---

## Version 7

### Code Changes

-   Added `useMinimap` composable to get minimap positional data in the Webview
-   Added `custom` message type when emitting messages to prevent formatting

### Docs Changes

-   Documented `useMinimap` composable

---

## Version 6

### Code Changes

-   Added `vehicle` synchronization when a vehicle document is bound to the vehicle
-   Added `useVehicle` function for synchronizing vehicle data, applying data, repairing, and creating new vehicle documents
    -   Synchronizes damage (not appearance)
    -   Synchronizes position, and rotation
    -   Synchronizes window damage
    -   Synchronizes tire damage
    -   Synchronizes dirt levels
    -   Synchronizes mods
-   Added `character` synchronization when a character document is bound to the player
    -   Synchronizes appearance, and clothing
    -   Synchronizes weapons, and ammo
    -   Synchronizes position, and rotation
    -   Synchronizes health, and armor
    -   Synchronizes death state
-   Added ways to disable auto-sync for `vehicle` and `character` documents in the `binding` functions
-   Added `onKeyUp` to the `Webview Events` functionality, allowing an easy way to listen for keybinds
-   Added `playFrontendSound` to `useAudio` composable in the webview
-   Added `useWeapon` to player pathway. Allows for synchronizing weapons, and ammo for database
-   Added ability for commands to be `async`
-   Separated logic for appyling data on `appearance` and `clothing` so overrides are possible
-   Changed all `update()` functions to `sync` and added backwards compatible `update` function
-   Split `Character` into `BaseCharacter` and `Character`, nothing changed externally

### Docs Changes

-   Updated `blip` controller docs for typo
-   Added `useVehicle` documentation
-   Updated documentation for `useCharacterBinder` that will allow ignoring auto-sync on binding
-   Updated documentation for `useVehicleBinder` that will allow ignoring auto-sync on binding
-   Added `useWeapon` documentation
-   Added `useState` documentation
-   Changed `update()` references to `sync()`
-   Updated documentation for `useAudio` composable

---

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

---

## Version 4

### Code Changes

-   Added `getCommands` to the `messenger` system
-   Added `formatTimestamp` to the shared utilities

---

## Version 3

### Code Changes

-   Added `focus` and `unfocus` support to client-side webviews

---

## Version 2

### Code Changes

-   Fixed issue with disabling plugins

---

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
