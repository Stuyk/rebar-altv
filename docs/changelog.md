---
order: 95
---

# Changelog

## Version 53

### Breaking Changes

-   Removed `useVehicleEvents`, `useCharacterEvents`, and `useAccountEvents`
    -   Replaced with `alt.on('rebar:vehicleUpdated')`, `alt.on('rebar:playerCharacterUpdated')`, and `alt.on('rebar:playerAccountUpdated')`.
-   Removed alt.getMeta for Rebar Imports
    -   This likely doesn't effect anyone
-   Removed `useServerTime`
    -   Replaced with `useWorldService`
-   Removed `useServerWeather`
    -   Replaced with `useWorldService`
-   Removed `useMessenger.message.on`,
    -   Same functionality can be achieved through `alt.on` with `playerSendMessage`
-   Removed `useRebarEvents` and moved all events to `alt.on` and `alt.emit`
    -   Custom delcarations are still possible.
    -   Replaced all `rebar-event-names` with `camelCased` events
    -   Event Name Changes:
        -   Renamed `message` event to `rebar:playerSendMessage`
        -   Renamed `on-command` event to `rebar:playerCommand`
        -   Renamed `on-rpc-restart` event to `rebar:rpcRestart`
        -   Renamed `account-bound` event to `rebar:playerAccountBound`
        -   Renamed `character-bound` event to `rebar:playerCharacterBound`
        -   Renamed `vehicle-bound` event to `rebar:vehicleBound`
        -   Renamed `page-opened` event to `rebar:playerPageOpened`
        -   Renamed `page-closed` event to `rebar:playerPageClosed`
        -   Renamed `time-changed` event to `rebar:timeChanged`
        -   Renamed `time-hour-changed` event to `rebar:timeHourChanged`
        -   Renamed `time-minute-changed` event to `rebar:timeMinuteChanged`
        -   Renamed `time-second-changed` event to `rebar:timeSecondChanged`
        -   Renamed `weather-changed` event to `rebar:weatherChanged`
        -   Renamed `weather-forecast-changed` event to `rebar:weatherForecastChanged`
        -   Renamed `doorLocked` event to `rebar:doorLocked`
        -   Renamed `doorUnlocked` event to `rebar:doorUnlocked`
-   Reworked permission system:
    -   Removed `permission` and `groupPermissions` properties from `useAccount` and `useCharacter`.
    -   When you check for players' permissions, it will automatically check both groups and plain permissions.

### Code Changes

-   Added more verbose error printing for plugin imports, should function like before again
-   Added ability to use string union for blip sprite types
    -   Automatically converted to numerical
-   Added ability to use string union for blip colors
    -   Automatically converted to numerical
-   Made blips shortRange parameter optional, and default to true
-   Updated `useWeapon` for `player` to properly save weapon data and ammo count
-   **Removed** `ammo` from the database, and ammo is now stored on the individual weapon instead
-   Fix vehicle handler so setting `{}` will actually clear the vehicle handling
-   Fix issue where removing attachements was not working correctly
-   Replaced in-house get closest entity function with `alt.getClosestEntities`
-   Changed `Account` from `type` to `interface`
-   Moved `Page Events` to `pageSystem` to keep functionality working
-   Made it so emitting notifications from server-side defaults to a GTA:V Notification, until a library is added
-   Added `useServiceRegister`
    -   Provides common APIs for common features to integrate custom functionality.
    -   Services do nothing until a library registers itself under a service.
-   Added `useCurrencyService`
    -   All these functions do nothing until a library is registered\
    -   add (invoke adding currency)
    -   sub (invoke removing currency)
    -   has (check if has enough currency)
    -   emits events when currency added or subtracted
-   Added `useDeathService`
    -   All these functions do nothing until a library is registered
    -   respawn (invoke a respawn)
    -   revive (invoke a revive, in place)
    -   emits events when respawned, or revived
-   Added `useItemService`
    -   All these functions do nothing until a library is registered
    -   add (invoke an item add)
    -   sub (invoke an item subtraction)
    -   remove (invoke an item remove)
    -   has (invoke if player has an item)
    -   itemCreate (create an item to add to the database)
    -   itemRemove (remove an item from the database)
    -   emits events when items added, subtracted, or removed
-   Added `useNotificationService`
    -   All these functions do nothing until a library is registered
    -   emit (invoke a notification send)
    -   broadcast (invoke a notification send, to all players)
    -   emits events when notification emitted, or broadcasted
-   Added `useTimeService`
    -   All these functions do nothing until a library is registered
    -   setTime (set the time for the whole server)
    -   getTime (get the current time for the server)
    -   emits events when time updated by hour, minute, or second
-   Added `useWeatherService`
    -   setWeather (set the weather for the server)
    -   setWeatherForecast (set weather forecast for the server)
    -   getWeather (get the current weather for the server)
    -   getWeatherForecast (get weather forecast for the server)
    -   emits events when weather updated, or forecast updated
-   Added Custom alt.getMeta Keys for...
    -   serverTime
    -   serverWeather
    -   serverWeatherForecast
-   Added support for interactions to
    -   addBlip
    -   addMarker
    -   addTextLabel
    -   getBlip
    -   getMarker
    -   getTextLabel
    -   getPos
    -   Destroy all of the above when interaction is destroyed
-   Updated Document Typings for ... to better handle module extension
    -   Account
    -   Character
    -   Vehicle
-   Added `rebar:onTick` which just emits a tick every 1 second for general usage
-   Added `isOverlayOpen` and `isPersistentPageOpen` to client-side for checking if a page is open
-   Made dev menu from the `webview:dev` command scrollable
-   Groups are now created globally, and you can assign players' documents to the group.
-   You can inherit a new group from another one; it will inherit all permissions from the parent.
-   You can now access permissions/groups of character/account via `useVirtual`.
-   Two new player-getters:
    -   `withPermission(documentType: 'account' | 'character' | 'any', permission: string)`
    -   `memberOfGroup(documentType: 'account' | 'character' | 'any', groupName: string)`
-   Updated weapon helpers to allow for `hash` or `string` models
-   Added `invokeWithResult` for player natives, to invoke a native and get a result
-   Added vehicle door sync for open / shut states

### Docs Changes

-   Document `getWeapons` and update documentation for `useWeapon` for the player
-   Document all services under `useService`
-   Document all event changes, and update events page
-   Document the new permission system.

---

## Version 52

### Code Changes

-   Added ability to change database name through environment variables — @floydya
-   Added door system controller — @floydya
-   Added server config option for disabling weapon wheel menu — @mnkyarts
-   Added onHold callback for `useKeypress` that invokes after `x` time has passed while holding a key — @koron
-   Updated `useKeypress` to include `onHold`, which is invoked after `2s` of holding

### Docs Changes

-   Added door system docs @floydya
-   Added `env` options for database name to useConfig page
-   Updated server config docs @mnkyarts
-   Updated `useKeypress` docs to include `onHold`

---

## Version 51

### Code Changes

-   Auto copy `nodemon-dev` and `nodemon-hot` files during script updates

---

## Version 50

### Code Changes

-   Permission system was redone by @floydya for better performance and usage
-   Added hot reloading option for `core and webview` resources, accessible through `dev:hot`
    -   This keeps you connected to the server while the resource itself reloads, it's quite fast
-   Split nodemon into two configurations, added new script for reloading

### Docs Changes

-   Permission system was updated / documented by @floydya
-   Documented `dev:hot` for install

---

## Version 49

### Code Changes

-   Updated Virtual Document to use a generic at the base level for the whole document
    -   This changes how Virtual Documents are constructed, and may break some things if you use virtual documents.
-   Added `useMessenger` to systems pathway
-   Fix vehicle handling so it always returns streamSyncedMeta data
-   Added `handling` to `useVehicle`
-   Added `vehicle` to `useVehicle`, makes it so you can do `rPlayer.player.pos`
-   Added `player` to `usePlayer`, makes it so you can do `rVehicle.vehicle.pos`
-   Changed Rebar endpoints to use Hono, and deprecated old server utility @floydya

### Docs Changes

-   Restructured the documentation
-   Documented `useCharacterEvents` and `useAccountEvents`
-   Combined getters documentation
-   Combined controllers documentation
-   Combined vehicle documentation

---

## Version 48

### Code Changes

-   Updated RPC endpoints
-   Began structuring new RPC endpoint functions
-   Server-side instructional buttons integrated by floydya

---

## Version 47

### Code Changes

-   Added an RPC endpoint under `http://127.0.0.1:8787` with endpoints `/restart`, `/`, and `/health`.
-   Fixed issue where reconnecting too early would cause client to be frozen on reconnecting
-   Restarting server now kicks all players while in dev mode only

---

## Version 46

### Code Changes

-   Added `useInteractionLocal` to create local interactions for individual players

### Docs Changes

-   Updated `useInteraction` to include `useInteractionLocal`

---

## Version 45

### Code Changes

-   Added `useVehicleHandling` function that lets you adjust handling per vehicle
-   Added object attachments for players, see `useAttachment` under the player endpoint

### Docs Changes

-   Documented `useVehicleHandling`
-   Documented `useAttachment`

---

## Version 44

### Code Changes

-   Fixed issue with setting global document data
-   Additionally, improved type casting support for global documents

### Docs Changes

-   Updated object document api to clarify generics usage

---

## Version 43

### Code Changes

-   Fixed local object initialization

### Docs Changes

-   N/A

---

## Version 42

### Code Changes

-   Added near perfect Torso, Top, and Undershirt data for 99% of tops
-   Added helper functions in shared clothing script to help obtain clothing data
-   Fixed bug where local objects were not being destroyed
-   Fixed bug where disabled plugins were copying files
-   Fixed bug where previous files were not cleaned up properly

### Docs Changes

-   N/A

---

## Version 41

### Code Changes

-   Added `useStreamSyncedBinder` to automatically synchronize document data from server to client for vehicles and characters
-   Added `useSyncedMeta` composable to the webview, to get data synced from `useStreamSyncedBinder`
-   Added `useStreamSyncedGetter` to client-side to get type safe responses for stream synced meta data

### Docs Changes

-   Documented `useStreamSyncedBinder`, `useSyncedMeta`, and `useStreamSyncedGetter`

---

## Version 40

### Code Changes

-   Added new dlc clothing maximums for 2024 DLC
-   Added `keypress` api that lets you bind functions to keyup/keydown from server-side
-   Added `setRpm` to vehicle API
-   Added new `fonts` resource, which may need to be imported in your `server.toml`; for custom fonts
-   Lower distance for all Text Labels; max distance now capped at 20
-   Failing readiness check on an API will now return the failing API's name
-   Added `D2D` text labels with global and local support

### Docs Changes

-   Documented keypress
-   Documented keypress in vehicle api
-   Documented fonts folder

---

## Version 39

### Code Changes

-   Potentially fixes bug where dependencies.json aren't installed outright
-   Fixes a `hasGroupPermission` function bug
-   Modified client side player camera with some new functions

### Docs Changes

-   N/A

---

## Version 38

### Code Changes

-   Added method to allow for Rebar Events to be extended via `global` declare.
-   Added `rPlayer.sound` pathway, works the same as `rPlayer.audio`
-   Moved images to https://github.com/Stuyk/gtav-image-archive/

### Docs Changes

-   Added documentation covering custom Rebar Events to the events api.

---

## Version 37

### Code Changes

-   Introduced method for clothing screeshots

### Docs Changes

-   N/A

## Version 36

### Code Changes

-   Added screenshot utility for weapons

### Docs Changes

-   Added weapon screenshot doc

---

## Version 35

### Code Changes

-   Added screenshot utility for taking screenshot of vehicle

### Docs Changes

-   Documented screenshot utility

---

## Version 34

### Code Changes

-   Adds a new ambient sound to the server config
-   Fixes an issue where subfolders were not supported for `images`, and `sounds`
-   Added `onScreenPed` solution to show a pedestrian in the 2D space, below webview
    -   Automatically synchronizes ped with ped reference changes, such as clothes
    -   Thanks to BattleZone for confirming that NVE is problematic with frontend menus
-   Added manual override for `useKeybinder` to `updateKeybindForPlayer`
-   Fixed bug where global documents were overwriting global cache
-   Modify `getByAccount` and `getByCharacter` to also take `numbers` for their `id` getter
-   Change `vehicle` `getByDatabaseId` to `byId('_id');`

### Docs Changes

-   Modifies the server config to include `disableAmbientNoise`
-   Added docs for `updateKeybindForPlayer`
-   Updated vehicle getter docs
-   Updated character getter docs

---

## Version 33

### Code Changes

-   Fixes issue where pickup sometimes doesn't spawn the object
-   Added all clothing dlc info, and maximums to a shared data structure
    -   Added clothing data getters to `Rebar.utility.clothing`
    -   Added addCategory section to add custom DLC data during runtime

### Docs Changes

-   Added utility clothes section to server API

---

## Version 32

### Code Changes

-   Added function to attach blips to entities, because alt:V's one is broken
-   Additionally, when a blip or the entity becomes invalid the blip is automatically destroyed.

### Docs Changes

-   Updated blip documentation to cover attachments

---

## Version 31

### Code Changes

-   Added `disableAttackControls`, `disableCameraControls`, and `freezeCamera` to player.world pathway
-   Fixed issue with local progress bars not clearing
-   Fixed issue with `gif` files not being copied correctly

### Docs Changes

-   Added documentation covering `player.world` new functions

---

## Version 30

### Code Changes

-   Added a `vscode transmitter` for debug mode server and client.
    -   Allows for code to be executed from VSCode using the Rebar Transmitter

### Docs Changes

-   Added vscode transmitter extension page

---

## Version 29

### Code Changes

-   Custom `rmlui` get distributed to `resources/rmlui/plugins` folder
-   Additionally `html` files act as `rmlui` and are converted into `rmlui` during the compile process

### Docs Changes

-   Added a section in `Plugin Structure` that covers how to work with `rmlui` correctly, and what the paths are to use the resource.

---

## Version 28

### Code Changes

-   Made interaction `setMessage` show a GTA:V notification by default when `entering`.
-   Synchronize vehicle `customPrimaryColor`, `customSecondaryColor`, `primaryColor`, and `secondaryColor`
-   Added `offKeyUp` to key listeners for webview composable
-   Added `disableCriticalHits` to server configuration settings
-   Added Rebar Event for `on-command` that lets you listen to what commands successfully executed
-   Improve performance of player stats by making it a single event for setting stats
-   Added `zone`, `isAiming`, and `isFlying` to player stats
-   Fix vehicle stop server config bug, flag was incorrect
-   Added server configs for disabling prop knockoff, cover, drivebys, and scuba gear removal

### Docs Changes

-   Added `onKeyUp` and `offKeyUp` to webview event composable
-   Updated `useServerConfig` docs
-   Updated playerStats doc

---

## Version 27

### Code Changes

-   Added `onClose` function for webview
-   Added `escapeToClosePage` to `show` function for webviews
    -   Keep in mind this only works for `page` types
-   Added `RebarEvent` for page open and page close on server-side

## Docs Changes

-   Updated `playerUse` webview section for `show` function to include info about escape to close
-   Added `RebarEvent` onClose and onOpen docs

---

## Version 26

### Code Changes

-   Added `useProgressbar` controller
-   Fixed permission length bug
-   Fixed some misnamed functions in other controllers
-   Added `useWorldMenu` controller for building quick selection menus
-   Fixed bug where keybinds could be invoked if certain menus were open

### Docs Changes

-   Added images for controllers
-   Added `useProgressbar` doc
-   Added `useWorldMenu` doc

---

## Version 25

### Code Changes

-   Added `account` document to `usePlayer`
-   Fixed small permission `hasOne` error
-   Added various shared `Utility` functions to Rebar.utility to lower import counts
-   Added toggle controls to `usePlayer().world` to control controls state
-   Fixed small bug where hotkeys could be invoked when game controls are disabled

### Docs Changes

-   Added code examples page
-   Added troubleshooting page
-   Updated player world api for toggling controls

---

## Version 24

### Code Changes

-   Added server configs for auto; starting engine, stopping engine, and seat swapping in vehicles
-   Added `useKeybinder` to bind hotkeys from server-side, enabling users to call from their client
-   Adjusted world space checker to delay by 100ms before checking, fixing colshape creation times

### Docs Changes

-   Updated server config doc
-   Added `useKeybinder` page

---

## Version 23

### Code Changes

-   Added `Draggable` Component to WebView

### Docs Changes

-   Added `Draggable` to `webview/components` section with an example on making draggables
-   Added `Draggable` Component to WebView

### Docs Changes

-   Added `Draggable` to `webview/components` section with an example on making draggables

---

## Version 22

### Code Changes

-   Added `useRateLimitCallback`
-   Added `onEnter` and `onLeave` to interaction callbacks
-   Added `disablePistolWhip` to `useServerConfig` that prevents pistol whipping one-hits

### Docs Changes

-   Created `useRateLimitCallback` docs
-   Added `onEnter` and `onLeave` to interaction docs
-   Added `disablePistolWhip` to `useServerConfig` docs

---

## Version 21

-   I forgot to write the changelogs. lmao

---

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
