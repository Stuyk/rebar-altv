# Animation

Play an animation on a player in various ways.

[Animation List](https://alexguirre.github.io/animations-list/)

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Create animation instance
const anim = Rebar.player.useAnimation(player);

// Play a handful of animations 2.5s after each one is played
// Dictionary
// Animation Name
// 31 = Flags
// 2500 = Time in MS
// Last parameter allows to skip clearing the animation for smoother transitions
await anim.playFinite('amb@world_human_stand_fishing@idle_a', 'idle_a', 31, 2500, true);
await anim.playFinite('amb@world_human_stand_guard@male@base', 'base', 31, 2500, true);
await anim.playFinite('amb@world_human_stand_guard@male@idle_a', 'idle_a', 31, 2500);

// Play an animation for an infinite amount of time, flags don't allow cancelling
await anim.playInfinite('amb@world_human_stand_fishing@idle_a', 'idle_a', 31, 2500);

// Clear animation
anim.clear();
```
