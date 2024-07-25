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

// Disable Engine from automatically starting when entered
serverConfig.set('disableVehicleEngineAutoStart', true);

// Disable Engine from automatically turning off when left
serverConfig.set('disableVehicleEngineAutoStop', true);

// When a passenger is in a vehicle with a driver,
// and the driver leaves. This prevents the passenger
// from sliding over to the next seat
serverConfig.set('disableVehicleSeatSwap', true);

// Disables headshot damage server wide
serverConfig.set('disableCriticalHits', true);

// Disables scuba gear from being removed once it's equipped
serverConfig.set('disableScubaGearRemoval', true);

// Disables prop knock off of hats, and such
serverConfig.set('disablePropKnockoff', true);

// Disables moving into cover for all players
serverConfig.set('disableCover', true);

// Disables performing drive bys for all players
serverConfig.set('disableDriveBys', true);

// Disables ambient noises around the map
serverConfig.set('disableAmbientNoise', true);

// Disables the Weapon Radial Menu
serverConfig.set('disableWeaponRadial', true);
```
