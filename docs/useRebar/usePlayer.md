---
order: 600
---

# usePlayer

While there is access to individual waypoints.

It is recommended that if you're accessing many waypoints to use the `usePlayer` function to get direct access to all functions without having to pass the player each time.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// More often than not, you will likely want to use this type of function setup for setting up a rebar player instance
async function doSomething(player: alt.Player) {
    const rebarPlayer = Rebar.usePlayer(player);

    // Additionally, it's wise to check for document availability if dealing with database data
    // This also checks `player.valid` and if `player` is valid as well.
    if (!rebarPlayer.isValid()) {
        // Invalid player, you decide what to do
        return;
    }

    // You also have direct access to the `character` document if it's already bound.
    rebarPlayer.notify.sendMessage(`{FFFFFF} Bank Balanace: $${rebarPlayer.character.getField('cash')}`);
    rebarPlayer.notify.sendMessage(`{FFFFFF} Cash Balanace: $${rebarPlayer.character.getField('bank')}`);
    rebarPlayer.notify.showNotification(`You checked your account balance!`);
}
```

## Animation

Play an animation on a player in various ways.

[Animation List](https://alexguirre.github.io/animations-list/)

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Create animation instance
const rebarPlayer = Rebar.usePlayer(player);

// Play a handful of animations 2.5s after each one is played
// Dictionary
// Animation Name
// 31 = Flags
// 2500 = Time in MS
// Last parameter allows to skip clearing the animation for smoother transitions
await rebarPlayer.animation.playFinite('amb@world_human_stand_fishing@idle_a', 'idle_a', 31, 2500, true);
await rebarPlayer.animation.playFinite('amb@world_human_stand_guard@male@base', 'base', 31, 2500, true);
await rebarPlayer.animation.playFinite('amb@world_human_stand_guard@male@idle_a', 'idle_a', 31, 2500);

// Play an animation for an infinite amount of time, flags don't allow cancelling
await rebarPlayer.animation.playInfinite('amb@world_human_stand_fishing@idle_a', 'idle_a', 31, 2500);

// Clear animation
rebarPlayer.animation.clear();
```

## Appearance

Used to set various freeroam character appearance data and store in the database.

!!!
All functions will automatically save to the database, except for `update`
!!!

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const rebarPlayer = Rebar.usePlayer(player);

// Get hair decorator for style, and save to database
const hairDecorator = rebarPlayer.appearance.getHairOverlay(0, 5);

// Set eye color and save to database
rebarPlayer.appearance.setEyeColor(5);

// Set eyebrow style and save to database
rebarPlayer.appearance.setEyebrows({ style: 1, color: 5, opacity: 1 });

// Set facial hair style and save to database
rebarPlayer.appearance.setFacialHair({ style: 5, color: 2, opacity: 1 });

// Set a hair style and save to database
rebarPlayer.appearance.setHairStyle({ hair: 5, color1: 25, color2: 25, decorator: hairDecorator });

// Set face appearance data
rebarPlayer.appearance.setHeadBlendData({
    faceFather: 0,
    faceMother: 0,
    skinFather: 5,
    skinMother: 45,
    faceMix: 0.5,
    skinMix: 0.5,
});

// Set to true to have a more feminine body
rebarPlayer.appearance.setModel(true);

// Set tattoos on the player and save to database
rebarPlayer.appearance.setTattoos([{ collection: 'mpairraces_overlays', overlay: 'MP_Airraces_Tattoo_000_M' }]);

// Called automatically, but resynchronizes freeroam player appearance
rebarPlayer.appearance.sync();
```

## Attachment

Used to attach an object to a player. Rotation is always set to fixed for attachments.

```ts
const rPlayer = Rebar.usePlayer(player);

rPlayer.attachment.add({
    uid: 'fishing-rod',
    model: 'prop_fishing_rod_01',
    bone: 58,
    offset: {
        x: -6.938893903907228e-18,
        y: -0.039999999999999994,
        z: 0.16,
    },
    rot: { x: -6.938893903907228e-18, y: -0.32, z: 0.18 },
});
```

## Audio

Play audio from frontend or using custom `.ogg` sound files.

!!!
If you want to use custom sound files, put them in the `webview/public/sounds` folder.
!!!

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Create audio instance for player
const rebarPlayer = Rebar.usePlayer(player);

// Play a custom sound from the public folder
rebarPlayer.audio.playSound('sounds/positive.ogg');

// Play a frontend sound that is native to GTA:V
rebarPlayer.audio.playFrontendSound('TIMER_STOP', 'HUD_MINI_GAME_SOUNDSET');
```

[Frontend Sound List](https://altv.stuyk.com/docs/articles/tables/frontend-sounds.html)

## Clothing

All of these functions can be used to adjust character clothing, skins, and uniforms.

Keep in mind that the render order is as follows.

1. If a skin is present we set the skin, and do nothing else.
2. If a skin is not present, we apply the clothes to the freeroam model
3. If a uniform is present, we apply the uniform to the freeroam model

Uniform will always be rendered last and will override clothing pieces.

!!!
All functions will automatically save to the database, except for `update`
!!!

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const rebarPlayer = Rebar.usePlayer(player);

// Set skin to something other than a freemode ped
rebarPlayer.clothing.setSkin('u_f_y_bikerchic');

// Clear skin, and reset to default freemode ped
rebarPlayer.clothing.clearSkin();

// Set uniform applies clothing to a character after their clothing is set, essentially overriding what they are wearing
rebarPlayer.clothing.setUniform([
    { dlc: alt.hash('some_dlc'), drawable: 0, id: 5, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 1, id: 6, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 7, id: 2, texture: 0 },
]);

// Clear uniform, this should be obvious
rebarPlayer.clothing.clearUniform();

// Set clothing and prop components and override everything
rebarPlayer.clothing.setClothing([
    { dlc: alt.hash('some_dlc'), drawable: 0, id: 5, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 1, id: 6, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 7, id: 2, texture: 0 },
]);

// Clear clothing removes all clothing and resets to default clothing values
rebarPlayer.clothing.clearClothing();

// This will remove a specific clothing component
rebarPlayer.clothing.removeClothingComponent('shoes');
rebarPlayer.clothing.removeClothingComponent('mask');

// This will use a dlc hash for the clothing component
rebarPlayer.clothing.setClothingComponent('mask', alt.hash('some_dlc'), 5, 0, 0);
rebarPlayer.clothing.setPropComponent('glasses', alt.hash('some_dlc'), 5, 0);

// Forces character clothing to update, and rerenders everything
rebarPlayer.clothing.sync();
```

## Native

Invoke client natives from server side.

Rebar is adding this because sometimes you don't want to create a whole file to invoke one native on client-side.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

// This example sets persistent weather over time
// This function is already built-in to the framework, but serves as a good example of usage
function setWeather(player: alt.Player, weather: string, timeInSeconds: number) {
    rebarPlayer.native.invoke('setWeatherTypeOvertimePersist', weather, timeInSeconds);
}

function setManyWeathers(player: alt.Player) {
    // Don't actually do this, just shows how to call many natives at once
    rebarPlayer.native.invokeMany([
        { native: 'setWeatherTypeOvertimePersist', args: ['BLIZZARD', 10000] },
        { native: 'setWeatherTypeOvertimePersist', args: ['CLEAR', 10000] },
        { native: 'setWeatherTypeOvertimePersist', args: ['THUNDER', 10000] },
    ]);
}
```

## Notify

Notify allows you to send different text and messages to the player screen.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

// Show text credits on the left side of the screen
rebarPlayer.notify.showCredits({ largeText: 'Hello', smallText: 'World', duration: 5000 });

// Show a 'wasted-like' text to the player
rebarPlayer.notify.showShard({ title: 'Hello', subtitle: 'World!', duration: 5000 });

// Show a spinner in the bottom right corner of the screen with text
rebarPlayer.notify.showSpinner({ text: 'Spinning!', duration: 5000, type: SpinnerType.CLOCKWISE_WHITE_0 });

// Show text in the bottom center of the screen, just like in the GTA:V missions
rebarPlayer.notify.showMissionText('Hello Mission Text!', 5000);

// Show a notification above the minimap.
// Additionally, if a notification is being intercepted on client-side. The notification will not show.
// Thus by default it uses GTA:V built-in native notifications until it does not.
rebarPlayer.notify.showNotification('Hello there');

// Send a message to the player
rebarPlayer.notify.sendMessage({ type: 'info', content: 'Hello there!' });
rebarPlayer.notify.sendMessage({ type: 'player', content: 'Hello there!', author: 'Some Other Player' });
```

## Screenshot

Used to get a screenshot of a player's screen.

Mostly used for utility such as getting vehicle screenshots, and such.

```ts
// Takes a single screenshot of the game, regardless of what is on screen
// outputs under 'screenshots/my-screenshot-name.jpg'
await rPlayer.screenshot.take('my-screenshot-name');

// Spawns a vehicle, and creates a camera to take a 'perfect' screenshot of a vehicle
// outputs under 'screenshots/infernus.jpg'
await rPlayer.screenshot.takeVehicleScreenshot(player, player.pos, 'infernus', alt.hash('infernus'));

// Spawns a weapon, forces the player into an animation, takes the screenshot
// outputs under 'screenshots/weapon_pistol50.jpg'
await rPlayer.screenshot.takeWeaponScreenshot(player, 'weapon_pistol50');
```

## Raycast

Used to get what the player is looking at, or find out other information

```ts
const rPlayer = Rebar.usePlayer(player);

// Commonly used raycast functions
const someVeh = await rPlayer.raycast.getFocusedEntity('vehicle');
const somePlayer = await rPlayer.raycast.getFocusedEntity('player');
const someAltvObject = await rPlayer.raycast.getFocusedEntity('object', true); // Adding true draws a debug line in-game

// Get a world object, the raycast hit position, and the entity position
const someWorldObject = await rPlayer.raycast.getFocusedObject(false); // Passing `true` draws a debug line in-game
console.log(someWorldObject.model, someWorldObject.pos, someWorldObject.scriptId, someWorldObject.entityPos);

// Position where the player is looking, intersects with everything
const somePos = await rPlayer.raycast.getFocusedPosition(false); // Passing `true` draws a debug line in-game
```

## Player State

Used to synchronize or apply weapons to a player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

// Use character document for weapons
rebarPlayer.state.sync();

// Save player state
rebarPlayer.state.save();

// Override and apply some state to a player
// This is likely never gonna be used outside core functionality
rebarPlayer.state.apply({ pos: alt.Vector3.zero });
```

## Status

Check if a player has an account bound, or character bound.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

rebarPlayer.status.hasCharacter(); // Returns true / false
rebarPlayer.status.hasAccount(); // Returns true / false
```

## Waypoint

Get a waypoint a player may or may not have currently marked on their map.

It can sometimes return undefined.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

async function doSomething(somePlayer: alt.Player) {
    const pos = await rebarPlayer.waypoint.get();
    if (!pos) {
        // no waypoint
        return;
    }

    // has waypoint
}
```

## Weapon

Used to synchronize or apply weapons to a player.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

// Use character document for weapons
rebarPlayer.weapon.sync();

// Save weapons & ammo
await rebarPlayer.weapon.save();

// Add a weapon, and save to the database, and re-apply weapons
await rebarPlayer.weapon.add('WEAPON_MINIGUN', 100);

// Add ammo for specific gun
await rebarPlayer.weapon.addAmmo('WEAPON_MINIGUN', 100);

// Clear all weapons & ammo
await rebarPlayer.weapon.clear();

// Remove a weapon and all ammo for the weapon
await rebarPlayer.weapon.clearWeapon('WEAPON_MINIGUN');

// Returns all weapons the database has stored for the player
const weapons = rebarPlayer.weapon.getWeapons();

// Override and apply weapons to a player
const weapons = [
    { hash: alt.hash('WEAPON_MINIGUN'), components: [], tintIndex: 0, ammo: 255 },
    { hash: alt.hash('WEAPON_RPG'), components: [], tintIndex: 0, ammo: 255 },
];

rebarPlayer.weapon.apply(weapons);
```

## Webview

This specific controller allows controlling the client-side webview instance for a given player.

You can focus the webview, hide pages, or show pages with ease.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function someWebviewThing(player: alt.Player, attempts = 0) {
    const rebarPlayer = Rebar.usePlayer(player);

    // Show the cursor and focus the webview instance
    rebarPlayer.webview.focus();

    // Hide the cursor and unfocus the webview instance
    rebarPlayer.webview.unfocus();

    // Hide a specific page
    rebarPlayer.webview.hide('Example');

    // Show a specific page
    rebarPlayer.webview.show('Example', 'page');

    // Show a specific page, but allow them to leave by pressing escape
    rebarPlayer.webview.show('Example', 'page', true);

    if (attempts >= 5) {
        player.kick('something went wrong');
        return;
    }

    // Wait for a page to be ready / shown before emitting events
    const result = await rebarPlayer.webview.isReady('Example', 'page');
    if (!result) {
        attempts++;

        showSelection(player, attempts);
        return;
    }

    // Emit directly into the webview, and recieve the event
    // in the webview with the 'useEvents' composable
    rebarPlayer.webview.emit('someevent', 'hello world!');
}
```

## World

These functions change what the player will see, or doesn't see.

Often used for `drunk effects`, `changing weather`, `changing time`, or `fading a screen to black`.

```ts
import { useRebar } from '@Server/index.js';
import { TimecycleTypes } from '@Shared/data/timecycleTypes.js';
import { ScreenEffects } from '@Shared/data/screenEffects.js';
import { Weathers } from '@Shared/data/weathers.js';

const Rebar = useRebar();
const rebarPlayer = Rebar.usePlayer(player);

// Toggle Game Controls
rebarPlayer.world.enableControls();
rebarPlayer.world.disableControls();

// Disable Camera Controls (still allows walking)
rebarPlayer.world.disableCameraControls(true);

// Disable Attacking (still allows walking)
rebarPlayer.world.disableAttackControls(true);

// Freeze gameplay camera, will freeze the gameplay camera in its last known place
// It's almost like dropping a camera on the ground
rebarPlayer.world.freezeCamera(true);

// Blur the screen over 5 seconds, and keep it blurred
rebarPlayer.world.setScreenBlur(5000);
rebarPlayer.world.clearScreenBlur(5000);

// Show a screen effect to the player like 'Trevors Rage' when using his special ability
rebarPlayer.world.setScreenEffect(ScreenEffects.RAMPAGE, 10000, true);
rebarPlayer.world.clearScreenEffect(ScreenEffects.RAMPAGE);
rebarPlayer.world.clearAllScreenEffects();

// Fade the screen to black over 5 seconds, and leave it black
rebarPlayer.world.setScreenFade(5000);
rebarPlayer.world.clearScreenFade(5000);

// Set the in-game GTA:V world time to 9 AM
rebarPlayer.world.setTime(9, 0, 0);

// Apply colors to the screen, best paired with screen effects as well
rebarPlayer.world.setTimecycle('stoned', 5000);

// Change the weather to Thunder over 5 seconds
rebarPlayer.world.setWeather('THUNDER', 5);

// Show a preview pedestrian on screen
rebarPlayer.world.showPedOnScreen('right');
rebarPlayer.world.hidePedOnScreen();
```
