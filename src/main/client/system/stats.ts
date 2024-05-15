import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';
import { Events } from '@Shared/events/index.js';

const view = useWebview();

const WeatherHashes = {
    '669657108': 'BLIZZARD',
    '916995460': 'CLEAR',
    '1840358669': 'CLEARING',
    '821931868': 'CLOUDS',
    '-1750463879': 'EXTRASUNNY',
    '-1368164796': 'FOGGY',
    '-921030142': 'HALLOWEEN',
    '-1148613331': 'OVERCAST',
    '1420204096': 'RAIN',
    '282916021': 'SMOG',
    '603685163': 'SNOWLIGHT',
    '-1233681761': 'THUNDER',
    '-1429616491': 'XMAS',
};

function update() {
    view.emit(Events.localPlayer.stats.health, alt.Player.local.health);
    view.emit(Events.localPlayer.stats.armour, alt.Player.local.armour);
    view.emit(Events.localPlayer.stats.weapon, alt.Player.local.currentWeapon);
    view.emit(Events.localPlayer.stats.ammo, alt.Player.local.currentAmmo);
    view.emit(Events.localPlayer.stats.stamina, alt.Player.local.stamina);
    view.emit(Events.localPlayer.stats.inWater, native.isPedSwimming(alt.Player.local));

    view.emit(Events.localPlayer.stats.inVehicle, alt.Player.local.vehicle ? true : false);
    view.emit(Events.localPlayer.stats.gear, alt.Player.local.vehicle ? alt.Player.local.vehicle.gear : 0);
    view.emit(Events.localPlayer.stats.maxGear, alt.Player.local.vehicle ? alt.Player.local.vehicle.maxGear : 0);
    view.emit(Events.localPlayer.stats.engineOn, alt.Player.local.vehicle ? alt.Player.local.vehicle.engineOn : false);
    view.emit(
        Events.localPlayer.stats.indicatorLights,
        alt.Player.local.vehicle ? alt.Player.local.vehicle.indicatorLights : 0,
    );
    view.emit(
        Events.localPlayer.stats.vehicleHealth,
        alt.Player.local.vehicle ? native.getVehicleEngineHealth(alt.Player.local.vehicle) : 0,
    );
    view.emit(
        Events.localPlayer.stats.speed,
        alt.Player.local.vehicle ? alt.Player.local.vehicle.speed : alt.Player.local.moveSpeed,
    );

    if (alt.Player.local.vehicle) {
        const [_voidLight, lights, highbeams] = native.getVehicleLightsState(alt.Player.local.vehicle);
        view.emit(Events.localPlayer.stats.lights, [lights, highbeams]);
    } else {
        view.emit(Events.localPlayer.stats.lights, [false, false]);
    }

    view.emit(Events.localPlayer.stats.isTalking, alt.isKeyDown(alt.Voice.activationKey));
    view.emit(Events.localPlayer.stats.fps, alt.getFps());
    view.emit(Events.localPlayer.stats.ping, alt.getPing());
    view.emit(Events.localPlayer.stats.time, native.getUtcTime());
    view.emit(Events.localPlayer.stats.weather, WeatherHashes[native.getPrevWeatherTypeHashName()]);

    const [_, streetNameHash, crossingRoadHash] = native.getStreetNameAtCoord(
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z,
    );

    const streetName = native.getStreetNameFromHashKey(streetNameHash);
    const crossingRoad = native.getStreetNameFromHashKey(crossingRoadHash);
    view.emit(Events.localPlayer.stats.street, [streetName, crossingRoad]);
}

alt.setInterval(update, 50);
