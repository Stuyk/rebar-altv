import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';

let disableCameraControls = false;
let disableAttackControls = false;
let interval: number;

function tick() {
    if (disableCameraControls) {
        // Camera Movement
        native.disableControlAction(0, 1, true);
        native.disableControlAction(0, 2, true);
        native.disableControlAction(0, 3, true);
        native.disableControlAction(0, 4, true);
        native.disableControlAction(0, 5, true);
        native.disableControlAction(0, 6, true);
    }

    if (disableAttackControls) {
        // Scroll Wheel
        native.disableControlAction(0, 14, true);
        native.disableControlAction(0, 15, true);
        native.disableControlAction(0, 16, true);
        native.disableControlAction(0, 17, true);

        // Attacking
        native.disableControlAction(0, 24, true);
        native.disableControlAction(0, 25, true);
    }
}

function setControls(state: boolean) {
    alt.toggleGameControls(state);
}

function setCameraFrozen(state: boolean) {
    alt.setCamFrozen(state);
}

function setCameraControlsDisabled(state: boolean) {
    disableCameraControls = state;

    if (!interval) {
        alt.setInterval(tick, 0);
    }
}

function setAttackControlsDisabled(state: boolean) {
    disableAttackControls = state;

    if (!interval) {
        alt.setInterval(tick, 0);
    }
}

export const useControls = () => ({
    setControls,
    setCameraFrozen,
    setCameraControlsDisabled,
    setAttackControlsDisabled,
});

alt.onServer(Events.player.controls.set, setControls);
alt.onServer(Events.player.controls.setCameraFrozen, setCameraFrozen);
alt.onServer(Events.player.controls.setCameraControlsDisabled, setCameraControlsDisabled);
alt.onServer(Events.player.controls.setAttackControlsDisabled, setAttackControlsDisabled);

alt.on('connectionComplete', () => {
    alt.setCamFrozen(false);
});
