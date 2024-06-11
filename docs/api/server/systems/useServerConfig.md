# useServerConfig

The server config controls player-wide aspects such as radar display, vehicle class display, etc.

```ts
const serverConfig = Rebar.useServerConfig();

// Hide area name when moving around the world
serverConfig.set('hideAreaName', true);

// Hide health and armour on radar
serverConfig.set('hideHealthArmour', true);

// Hide minimap when a page is opened
serverConfig.set('hideMinimapInPage', true);

// Hide minimap when a player is on foot
serverConfig.set('hideMinimapOnFoot', true);

// Hide street name
serverConfig.set('hideStreetName', true);

// Hide vehicle class when entering a vehicle
serverConfig.set('hideVehicleClass', true);

// Hide vehicle name when entering a vehicle
serverConfig.set('hideVehicleName', true);

// Disable pistol whipping
serverConfig.set('disablePistolWhip', true);
```
