# Native

Invoke client natives from server side.

Rebar is adding this because sometimes you don't want to create a whole file to invoke one native on client-side.

```ts
import * as alt from 'alt-server';
import { useNative } from '@Server/player/native.js';

// This example sets persistent weather over time
// This function is already built-in to the framework, but serves as a good example of usage
function setWeather(player: alt.Player, weather: string, timeInSeconds: number) {
    useNative(player).invoke('setWeatherTypeOvertimePersist', weather, timeInSeconds);
}

function setManyWeathers(player: alt.Player) {
    // Don't actually do this, just shows how to call many natives at once
    useNative(player).invokeMany([
        { native: 'setWeatherTypeOvertimePersist', args: ['BLIZZARD', 10000] },
        { native: 'setWeatherTypeOvertimePersist', args: ['CLEAR', 10000] },
        { native: 'setWeatherTypeOvertimePersist', args: ['THUNDER', 10000] },
    ]);
}
```
