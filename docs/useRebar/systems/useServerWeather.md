# useServerWeather

This stores server weather during runtime, and allows for weather to be shared to other plugins.

Additionally, when these functions are used the internal RebarEvents for weather changes are invoked.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const serverWeather = Rebar.useServerWeather();

function whatever() {
    // Used as a way to store the current weather on server-side for other plugins
    serverWeather.set('CLEARING');

    // Used as a way to show a weather forecast for the upcoming weather events
    serverWeather.setForecast(['CLEAR', 'CLOUDS', 'RAIN', 'THUNDER', 'FOGGY', 'CLOUDS', 'CLEARING', 'EXTRASUNNY'])

    const currentWeather = serverWeather.get();

    const currentForecast = serverWeather.getForecast();
}
```
