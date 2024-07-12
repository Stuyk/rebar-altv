import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';
import { Events } from '@Shared/events/index.js';
import { getPreviousWeatherType, getStreetInfo, getDirection, getZone } from '../utility/world/index.js';
import { PlayerStats } from '../../shared/types/playerStats.js';

const view = useWebview();

function update() {
    let lights = false;
    let highbeams = false;

    if (alt.Player.local.vehicle) {
        const [_voidLight, _lights, _highbeams] = native.getVehicleLightsState(alt.Player.local.vehicle);
        lights = _lights;
        highbeams = _highbeams;
    }

    const [_voidTime, year, month, day, hour, minute, second] = native.getUtcTime();

    const stats: PlayerStats = {
        ammo: alt.Player.local.currentAmmo,
        armour: alt.Player.local.armour,
        direction: getDirection(alt.Player.local),
        engineOn: alt.Player.local.vehicle ? alt.Player.local.vehicle.engineOn : false,
        fps: alt.getFps(),
        gear: alt.Player.local.vehicle ? alt.Player.local.vehicle.gear : 0,
        health: alt.Player.local.health,
        indicatorLights: alt.Player.local.vehicle ? alt.Player.local.vehicle.indicatorLights : 0,
        inVehicle: alt.Player.local.vehicle ? true : false,
        inWater: native.isPedSwimming(alt.Player.local),
        isAiming: native.isControlPressed(0, 25) && native.isPedArmed(alt.Player.local, 6),
        isMetric: native.shouldUseMetricMeasurements(),
        isFlying: native.isPedInFlyingVehicle(alt.Player.local),
        isTalking: alt.isKeyDown(alt.Voice.activationKey),
        lights: [lights, highbeams],
        locked: alt.Player.local.vehicle ? alt.Player.local.vehicle.lockState === 2 : false,
        maxGear: alt.Player.local.vehicle ? alt.Player.local.vehicle.maxGear : 0,
        ping: alt.getPing(),
        seat: alt.Player.local.vehicle ? alt.Player.local.seat : 0,
        speed: alt.Player.local.vehicle ? native.getEntitySpeed(alt.Player.local.vehicle) : alt.Player.local.moveSpeed,
        stamina: alt.Player.local.stamina,
        street: getStreetInfo(alt.Player.local.pos),
        time: { hour, minute, second },
        vehicleClass: alt.Player.local.vehicle ? native.getVehicleClass(alt.Player.local.vehicle) : -1,
        vehicleHealth: alt.Player.local.vehicle ? native.getVehicleEngineHealth(alt.Player.local.vehicle) : 0,
        weapon: alt.Player.local.currentWeapon,
        weather: getPreviousWeatherType(),
        zone: getZone(alt.Player.local.pos),
    };

    view.emit(Events.localPlayer.stats.set, stats);
}

alt.setInterval(update, 50);
