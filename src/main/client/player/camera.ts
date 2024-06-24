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
    } catch (err) {}

    try {
        native.setCamActive(camera, false);
    } catch (err) {}

    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);
    interval = undefined;
    camera = undefined;
}

export function useCamera() {
    let camPos: alt.Vector3;

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
        camPos = alt.Player.local.pos.add(fwd.x * 2, fwd.y * 2, options.zOffset);

        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            camPos.x,
            camPos.y,
            camPos.z,
            0,
            0,
            0,
            55,
            false,
            1,
        );

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

    function pointAtBone(bone: keyof typeof PedBones) {
        if (!camera) {
            return;
        }

        native.pointCamAtPedBone(camera, alt.Player.local, PedBones[bone], 0, 0, 0, false);
        native.renderScriptCams(true, true, 1000, false, false, 0);
    }

    function setFov(value: number) {
        if (!camera) {
            return;
        }

        native.setCamFov(camera, value);
        native.renderScriptCams(true, true, 1000, false, false, 0);
    }

    function setOffset(offset: number) {
        if (!camera) {
            return;
        }

        native.setCamCoord(camera, camPos.x, camPos.y, camPos.z + offset);
    }

    return {
        create,
        destroy,
        get() {
            return camera;
        },
        setFov,
        setOffset,
        pointAtBone,
    };
}

alt.on('disconnect', destroy);
