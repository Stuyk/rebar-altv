# useServerTime

This stores server time during runtime, and allows for time to be shared to other plugins.

Additionally, when these functions are used the internal RebarEvents for time changes are invoked.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const ServerTime = Rebar.useServerTime();

function whatever() {
    // Returns { hour, minute, second }
    const { hour, minute, second } = ServerTime.getTime();

    // Get current time
    const currentTime = new Date(Date.now());
    ServerTime.setHour(currentTime.getHours());
    ServerTime.setMinute(currentTime.getMinutes());
    ServerTime.setSecond(currentTime.getSeconds());
}
```
