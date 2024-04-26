# World

These functions change what the player will see, or doesn't see.

Often used for `drunk effects`, `changing weather`, `changing time`, or `fading a screen to black`.

```ts
import { useWorld } from '@Server/player/world.js';
import { TimecycleTypes } from '../../shared/data/timecycleTypes.js';
import { ScreenEffects } from '../../shared/data/screenEffects.js';
import { Weathers } from '../../shared/data/weathers.js';

// Access player world
const playerWorld = useWorld(somePlayer);

// Blur the screen over 5 seconds, and keep it blurred
playerWorld.setScreenBlur(5000);
playerWorld.clearScreenBlur(5000);

// Show a screen effect to the player like 'Trevors Rage' when using his special ability
playerWorld.setScreenEffect(ScreenEffects.RAMPAGE, 10000, true);
playerWorld.clearScreenEffect(ScreenEffects.RAMPAGE);
playerWorld.clearAllScreenEffects();

// Fade the screen to black over 5 seconds, and leave it black
playerWorld.setScreenFade(5000);
playerWorld.clearScreenFade(5000);

// Set the in-game GTA:V world time to 9 AM
playerWorld.setTime(9, 0, 0);

// Apply colors to the screen, best paired with screen effects as well
playerWorld.setTimecycle('stoned', 5000);

// Change the weather to Thunder over 5 seconds
playerWorld.setWeather('THUNDER', 5);
```
