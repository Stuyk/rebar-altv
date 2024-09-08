import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';
import { useBuffer } from '../../shared/utility/buffer.js';

const BufferHelper = useBuffer();
let id: string;
let cam: number;
let interval: number;
let shouldDelete = false;

const CLOTHING_IDS = {
    MASKS: 1,
    HAIR: 2,
    TORSOS: 3,
    LEGS: 4,
    BAGS: 5,
    SHOES: 6,
    ACCESSORIES: 7,
    UNDERSHIRTS: 8,
    BODY_ARMOUR: 9,
    TOP: 11,
};

const PROP_IDS = {
    HATS: 0,
    GLASSES: 1,
    EARS: 2,
    WATCHES: 6,
    BRACELETS: 7,
};

const ClothingCameras = {
    // 1
    [CLOTHING_IDS.MASKS]: {
        fov: 30,
        rotation: {
            x: 0,
            y: 0,
            z: -200,
        },
        zPos: 0.65,
    },
    // 2
    [CLOTHING_IDS.HAIR]: {
        fov: 20,
        rotation: {
            x: 0,
            y: 0,
            z: -200,
        },
        zPos: 0.75,
    },
    // 3
    [CLOTHING_IDS.TORSOS]: {
        fov: 50,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: 0.03,
    },
    // 4
    [CLOTHING_IDS.LEGS]: {
        fov: 75,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: -0.35,
    },
    // 5
    [CLOTHING_IDS.BAGS]: {
        fov: 40,
        rotation: {
            x: 0,
            y: 0,
            z: -345,
        },
        zPos: 0.2,
    },
    // 6
    [CLOTHING_IDS.SHOES]: {
        fov: 40,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: -0.85,
    },
    // 7
    [CLOTHING_IDS.ACCESSORIES]: {
        fov: 45,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: 0.03,
    },
    // 8
    [CLOTHING_IDS.UNDERSHIRTS]: {
        fov: 50,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: 0.03,
    },
    // 9
    [CLOTHING_IDS.BODY_ARMOUR]: {
        fov: 45,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: 0.03,
    },
    // 11
    [CLOTHING_IDS.TOP]: {
        fov: 60,
        rotation: {
            x: 0,
            y: 0,
            z: -165,
        },
        zPos: 0.05,
    },
};

const PropCameras = {
    // 0
    [PROP_IDS.HATS]: {
        fov: 30,
        rotation: {
            x: 0,
            y: 0,
            z: -200,
        },
        zPos: 0.65,
    },
    // 1
    [PROP_IDS.GLASSES]: {
        fov: 20,
        rotation: {
            x: 0,
            y: 0,
            z: -200,
        },
        zPos: 0.8,
    },
    // 2
    [PROP_IDS.EARS]: {
        fov: 20,
        rotation: {
            x: 0,
            y: 0,
            z: -82.5,
        },
        zPos: 0.675,
    },
    // 6
    [PROP_IDS.WATCHES]: {
        fov: 20,
        rotation: {
            x: 0,
            y: 0,
            z: -247.5,
        },
        zPos: 0,
    },
    // 7
    [PROP_IDS.BRACELETS]: {
        fov: 20,
        rotation: {
            x: 0,
            y: 0,
            z: -82.5,
        },
        zPos: -0.05,
    },
};

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

async function setupClothingScreenshot(id: number, flipCamera: boolean) {
    shouldDelete = false;
    const camInfo = ClothingCameras[id];
    const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
    let fwdPos = alt.Player.local.pos.add(fwd.x * 1.2, fwd.y * 1.2, 0);
    if (flipCamera) {
        fwdPos = alt.Player.local.pos.sub(fwd.x * 1.2, fwd.y * 1.2, 0);
    }

    try {
        cam = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            fwdPos.x,
            fwdPos.y,
            alt.Player.local.pos.z + camInfo.zPos,
            0,
            0,
            0,
            camInfo.fov,
            false,
            1,
        );
        native.pointCamAtCoord(
            cam,
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z + camInfo.zPos,
        );
        native.setCamActive(cam, true);
        native.renderScriptCams(true, true, 0, false, false, 0);
    } catch (err) {
        return false;
    }

    interval = alt.everyTick(() => {
        native.hideHudAndRadarThisFrame();
        native.setPedCanHeadIk(alt.Player.local.scriptID, false);
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
alt.onRpc(Events.systems.screenshot.setClothing, setupClothingScreenshot);
