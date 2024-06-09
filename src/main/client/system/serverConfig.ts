import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';

function tick() {
    const config = alt.getMeta('ServerConfig');
    if (!config) {
        return;
    }

    if (config.hideHealthArmour) {
        alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();
    }

    if (config.hideVehicleName) {
        native.hideHudComponentThisFrame(6);
    }

    if (config.hideVehicleClass) {
        native.hideHudComponentThisFrame(8);
    }

    if (config.hideStreetName) {
        native.hideHudComponentThisFrame(9);
    }

    if (config.hideAreaName) {
        native.hideHudComponentThisFrame(7);
    }

    let finalRadarState = true;

    if (config.hideMinimapOnFoot) {
        finalRadarState = alt.Player.local.vehicle ? false : true;
    }

    if (config.hideMinimapInPage && useWebview().isAnyPageOpen()) {
        finalRadarState = false;
    }

    native.displayRadar(finalRadarState);
}

alt.everyTick(tick);
