import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';
import { ServerConfig } from '../../shared/types/serverConfig.js';
import { Events } from '../../shared/events/index.js';

let config: ServerConfig = {};
let lastRadarState = true;

function tick() {
    console.log(config);

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
        finalRadarState = alt.Player.local.vehicle ? true : false;
    }

    if (config.hideMinimapInPage && useWebview().isAnyPageOpen()) {
        finalRadarState = false;
    }

    if (lastRadarState === finalRadarState) {
        return;
    }

    lastRadarState = finalRadarState;
    native.displayRadar(finalRadarState);
}

alt.everyTick(tick);
alt.onServer(Events.systems.serverConfig.set, (newConfig: ServerConfig) => (config = newConfig));
