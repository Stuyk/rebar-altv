import * as alt from 'alt-client';
import * as native from 'natives';
import { PedBones } from '../../shared/data/pedBones.js';

let camera: number;
let interval: number;

function tick() {
    native.setUseHiDof();
}

function destroy() {
    try {
        alt.clearInterval(interval);
    } catch(err) {}

    interval = undefined;
    native.destroyAllCams(true);
    native.setCamActive(camera, false);
    native.renderScriptCams(false, false, 0, false, false, 0);
    camera = undefined;
}

export function useCamera() {
    function create(
        options: { fov: number; zOffset: number; bone: keyof typeof PedBones } = {
            fov: 30,
            zOffset: 0.8,
            bone: 'IK_Head',
        },
    ) {
        if (camera) {
            return;
        }

        const fwd = native.getEntityForwardVector(alt.Player.local);
        const pos = alt.Player.local.pos.add(fwd.x * 2, fwd.y * 2, options.zOffset);

        camera = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y, pos.z, 0, 0, 0, 55, false, 1);

        native.setCamUseShallowDofMode(camera, true);
        native.setCamFov(camera, options.fov);
        native.setCamNearDof(camera, 0.2);
        native.setCamFarDof(camera, 3.5);
        native.setCamDofStrength(camera, 1);
        native.setCamActive(camera, true);

        native.pointCamAtPedBone(camera, alt.Player.local, PedBones[options.bone], 0, 0, 0, false);
        native.renderScriptCams(true, true, 1000, false, false, 0);

        if (typeof interval === 'undefined') {
            interval = alt.setInterval(tick, 0);
        }
    }

    return {
        create,
        destroy,
        get() {
            return camera;
        },
    };
}

alt.on('disconnect', destroy);
