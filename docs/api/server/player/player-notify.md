# Notify

Notify allows you to send different text and messages to the player screen.

```ts
import { useNotify } from '@Server/player/notify.js';

const notify = useNotify(player);

// Show text credits on the left side of the screen
notify.showCredits({ largeText: 'Hello', smallText: 'World', duration: 5000 });

// Show a 'wasted-like' text to the player
notify.showShard({ title: 'Hello', subtitle: 'World!', duration: 5000 });

// Show a spinner in the bottom right corner of the screen with text
notify.showSpinner({ text: 'Spinning!', duration: 5000, type: SpinnerType.CLOCKWISE_WHITE_0 });

// Show text in the bottom center of the screen, just like in the GTA:V missions
notify.showMissionText('Hello Mission Text!', 5000);

// Show a notification above the minimap.
// Additionally, if a notification is being intercepted on client-side. The notification will not show.
// Thus by default it uses GTA:V built-in native notifications until it does not.
notify.showNotification('Hello there');
```
