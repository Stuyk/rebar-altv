import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';
import { Events } from '@Shared/events/index.js';
import { getPreviousWeatherType, getStreetInfo, getDirection } from '../utility/world/index.js';

const view = useWebview();

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
        Events.localPlayer.stats.locked,
        alt.Player.local.vehicle ? alt.Player.local.vehicle.lockState === 2 : false,
    );
    view.emit(Events.localPlayer.stats.seat, alt.Player.local.vehicle ? alt.Player.local.seat : 0);
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
    view.emit(Events.localPlayer.stats.weather, getPreviousWeatherType());
    view.emit(Events.localPlayer.stats.street, getStreetInfo(alt.Player.local));
    view.emit(Events.localPlayer.stats.direction, getDirection(alt.Player.local));
}

alt.setInterval(update, 50);
