import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../webview/index.js';
import { ServerConfig } from '../../shared/types/serverConfig.js';
import { Events } from '../../shared/events/index.js';

let config: ServerConfig = {};
let lastRadarState = true;

function tick() {
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

    if (config.disablePistolWhip) {
        native.setPedResetFlag(alt.Player.local.scriptID, 187, true);
    }

    if (config.disablePropKnockoff) {
        native.setPedConfigFlag(alt.Player.local, 423, true);
    }

    if (config.disableScubaGearRemoval) {
        native.setPedConfigFlag(alt.Player.local, 409, true);
    }

    if (config.disableDriveBys) {
        native.setPlayerCanDoDriveBy(alt.Player.local, false);
    }

    if (config.disableCover) {
        native.setPlayerCanUseCover(alt.Player.local, false);
    }

    let finalRadarState = true;

    if (config.hideMinimapOnFoot) {
        finalRadarState = alt.Player.local.vehicle ? true : false;
    }

    if (config.hideMinimapInVehicle && alt.Player.local.vehicle) {
        finalRadarState = false;
    }

    if (config.hideMinimapInPage && useWebview().isAnyPageOpen()) {
        finalRadarState = false;
    }

    if (lastRadarState === finalRadarState && lastRadarState === !native.isRadarHidden()) {
        return;
    }

    lastRadarState = finalRadarState;
    native.displayRadar(finalRadarState);
}

function onEnteringVehicle(vehicle: alt.Vehicle, seat: number, player: alt.Player) {
    if (player.scriptID !== alt.Player.local.scriptID) {
        return;
    }

    // Disable seat swap
    if (config.disableVehicleSeatSwap) {
        native.setPedConfigFlag(alt.Player.local, 184, true);
    }

    // Disable engine auto start
    if (config.disableVehicleEngineAutoStart) {
        native.setPedConfigFlag(alt.Player.local, 429, true);
    }

    // Disable engine auto stop
    if (config.disableVehicleEngineAutoStop) {
        native.setPedConfigFlag(alt.Player.local, 241, true);
    }
}

function handleEntityCreate(entity: alt.Entity) {
    if (entity instanceof alt.Player) {
        if (config.disableCriticalHits) {
            native.setPedSuffersCriticalHits(entity, false);
        }

        if (config.disablePropKnockoff) {
            native.setPedConfigFlag(entity.scriptID, 423, true);
        }

        if (config.disableScubaGearRemoval) {
            native.setPedConfigFlag(entity.scriptID, 409, true);
        }
    }
}

alt.everyTick(tick);
alt.onServer(Events.systems.serverConfig.set, (newConfig: ServerConfig) => (config = newConfig));
alt.on('startEnteringVehicle', onEnteringVehicle);
alt.on('gameEntityCreate', handleEntityCreate);
