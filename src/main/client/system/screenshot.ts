import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';
import { useBuffer } from '../../shared/utility/buffer.js';

const BufferHelper = useBuffer();
let id: string;
let cam: number;
let interval: number;
let shouldDelete = false;

export async function buildScreenshot() {
    const result = await alt.takeScreenshotGameOnly();
    const data = BufferHelper.toBuffer(result, 128);
    const totalLength = data.length;

    return {
        getData() {
            return data;
        },
        getLength() {
            return totalLength;
        },
    };
}

function destroyCamera() {
    try {
        native.setCamActive(cam, false);
    } catch (err) {}

    if (interval) {
        alt.clearInterval(interval);
        interval = undefined;
    }

    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);
    cam = undefined;
}

async function setupVehicleScreenshot(vehicle: alt.Vehicle) {
    await alt.Utils.waitFor(() => typeof interval === 'undefined', 5000).catch((err) => {});

    shouldDelete = false;

    try {
        await alt.Utils.waitFor(() => native.doesEntityExist(vehicle));
        const [_, min, max] = native.getModelDimensions(vehicle.model, alt.Vector3.zero, alt.Vector3.zero);
        const size = Math.abs(min.y) + Math.abs(max.y);
        const height = Math.abs(min.z) + Math.abs(max.z);

        const fwd = native.getEntityForwardVector(alt.Player.local);
        const pos = alt.Player.local.pos.add(fwd.x * size, fwd.y * size, height);

        cam = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y, pos.z, 0, 0, 0, 70, false, 1);

        native.setCamFov(cam, 70);
        native.setCamActive(cam, true);
        native.pointCamAtEntity(cam, vehicle, 0, 0, 0, true);
        native.renderScriptCams(true, true, 0, false, false, 0);
    } catch (err) {
        return false;
    }

    interval = alt.everyTick(() => {
        native.hideHudAndRadarThisFrame();

        if (shouldDelete) {
            alt.clearEveryTick(interval);
            destroyCamera();
            shouldDelete = false;
            return;
        }
    });

    return true;
}

async function setupWeaponScreenshot() {
    await alt.Utils.waitFor(() => typeof interval === 'undefined', 5000).catch((err) => {});
    await alt.Utils.waitFor(() => native.isEntityPlayingAnim(alt.Player.local, 'nm@hands', 'hands_up', 3), 5000);

    await alt.Utils.wait(500);

    shouldDelete = false;

    native.setEntityHeading(alt.Player.local.scriptID, 6);

    try {
        const coords = native.getPedBoneCoords(alt.Player.local.scriptID, 6286, 0, 0, 0);

        cam = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            coords.x,
            coords.y,
            alt.Player.local.pos.z + 2,
            0,
            0,
            0,
            50,
            false,
            1,
        );
        native.setCamActive(cam, true);
        native.pointCamAtCoord(cam, coords.x, coords.y, coords.z);

        // native.pointCamAtEntity(cam, alt.Player.local.scriptID, 0, 0, 0, true);
        native.renderScriptCams(true, true, 0, false, false, 0);
    } catch (err) {
        return false;
    }

    await alt.Utils.wait(2000);

    interval = alt.everyTick(() => {
        native.hideHudAndRadarThisFrame();
        native.setPedCurrentWeaponVisible(alt.Player.local.scriptID, true, true, true, true);

        if (shouldDelete) {
            alt.clearEveryTick(interval);
            destroyCamera();
            shouldDelete = false;
            return;
        }
    });

    return true;
}

alt.onServer(Events.systems.screenshot.take, async (uid: string) => {
    id = uid;
    const screenshot = await buildScreenshot();

    shouldDelete = true;
    for (let i = 0; i < screenshot.getLength(); i++) {
        alt.emitServer(Events.systems.screenshot.get, id, screenshot.getData()[i], i, screenshot.getLength());
    }
});

alt.onRpc(Events.systems.screenshot.takeWeapon, setupWeaponScreenshot);
alt.onRpc(Events.systems.screenshot.takeVehicle, setupVehicleScreenshot);
