# Audio

Play audio from frontend or using custom `.ogg` sound files.

!!!
If you want to use custom sound files, put them in the `webview/public/sounds` folder.
!!!

```ts
import { useAudio } from '@Server/player/audio.js';

// Create audio instance for player
const audio = useAudio(player);

// Play a custom sound from the public folder
audio.playSound('sounds/positive.ogg');

// Play a frontend sound that is native to GTA:V
audio.playFrontendSound('TIMER_STOP', 'HUD_MINI_GAME_SOUNDSET');
```

[Frontend Sound List](https://altv.stuyk.com/docs/articles/tables/frontend-sounds.html)
