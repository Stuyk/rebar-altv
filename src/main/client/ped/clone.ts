import * as alt from 'alt-client';
import * as native from 'natives';
import { Appearance } from '../../shared/types/appearance.js';
import { PedBones } from '../../shared/data/pedBones.js';
import { ClothingComponent } from '../../shared/types/clothingComponent.js';

type CameraOptions = { fov: number; zOffset: number; bone: keyof typeof PedBones };

let interval: number;

function tick() {
    native.setUseHiDof();
}

export function useClonedPed() {
    let ped: number;
    let lastModel: number;
    let camera: number;
    let lastCameraOptions: CameraOptions;

    function destroyPed() {
        lastModel = undefined;

        if (typeof ped === 'undefined') {
            return;
        }

        try {
            native.setEntityAlpha(ped, 0, true);
            native.deletePed(ped);
            native.setPedAsNoLongerNeeded(ped);
            ped = undefined;
        } catch (err) {}
    }

    async function updatePed(
        appearance: Appearance,
        clothing: ClothingComponent[],
        options: { pos: alt.Vector3; heading: number },
    ) {
        if (!appearance) {
            return;
        }

        await alt.Utils.requestModel('mp_f_freemode_01');
        await alt.Utils.requestModel('mp_m_freemode_01');

        const model = appearance.sex === 0 ? alt.hash('mp_f_freemode_01') : alt.hash('mp_m_freemode_01');

        if (lastModel !== model) {
            destroyPed();
            lastModel = model;
            ped = native.createPed(1, model, options.pos.x, options.pos.y, options.pos.z, 0, false, false);
            native.setEntityCoordsNoOffset(ped, options.pos.x, options.pos.y, options.pos.z, false, false, false);
            native.freezeEntityPosition(ped, true);
            native.setEntityInvincible(ped, true);
            native.setEntityRotation(ped, 0, 0, options.heading, 1, false);
            native.setPedDesiredHeading(ped, options.heading);
            native.taskSetBlockingOfNonTemporaryEvents(ped, true);
            native.setBlockingOfNonTemporaryEvents(ped, true);
            native.setPedFleeAttributes(ped, 0, true);
            native.setPedCombatAttributes(ped, 17, true);
            native.setPedAsEnemy(ped, false);
        }

        await alt.Utils.waitFor(() => native.doesEntityExist(ped), 5000);
        if (typeof ped === 'undefined') {
            return;
        }

        native.clearPedDecorations(ped);
        native.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        native.setPedHeadBlendData(
            ped,
            appearance.faceMother,
            appearance.faceFather,
            0,
            appearance.skinMother,
            appearance.skinFather,
            0,
            appearance.faceMix,
            appearance.skinMix,
            0,
            false,
        );

        // Hair
        native.setPedComponentVariation(ped, 2, appearance.hair, 0, 0);
        native.setPedHairTint(ped, appearance.hairColor1, appearance.hairColor2);

        // Hair Overlay
        native.addPedDecorationFromHashes(
            ped,
            alt.hash(appearance.hairOverlay.collection),
            alt.hash(appearance.hairOverlay.overlay),
        );

        // Eyebrows
        native.setPedHeadOverlay(ped, 2, appearance.eyebrows, appearance.eyebrowsOpacity);
        native.setPedHeadOverlayTint(ped, 2, 1, appearance.eyebrowsColor1, appearance.eyebrowsColor1);

        // Facial Hair
        native.setPedHeadOverlay(ped, 1, appearance.facialHair, appearance.facialHairOpacity);
        native.setPedHeadOverlayTint(ped, 1, 1, appearance.facialHairColor1, appearance.facialHairColor1);

        for (let i = 0; i < appearance.structure.length; i++) {
            native.setPedMicroMorph(ped, i, appearance.structure[i]);
        }

        for (let i = 0; i < appearance.headOverlays.length; i++) {
            native.setPedHeadOverlay(
                ped,
                appearance.headOverlays[i].id,
                appearance.headOverlays[i].value,
                appearance.headOverlays[i].opacity,
            );
            native.setPedHeadOverlayTint(
                ped,
                appearance.headOverlays[i].id,
                2,
                appearance.headOverlays[i].color1,
                appearance.headOverlays[i].color2,
            );
        }

        native.setHeadBlendEyeColor(ped, appearance.eyes);

        // Clearing all props
        native.clearAllPedProps(ped, 0);

        // Default Clothes for Even Customization
        for (let component of clothing) {
            if (component.isProp) {
                if (component.dlc != 0) {
                    alt.setPedDlcProp(ped, component.dlc, component.id, component.drawable, component.texture);
                    continue;
                }

                native.setPedPropIndex(ped, component.id, component.drawable, component.texture, true, 0);
                continue;
            }

            if (component.dlc != 0) {
                alt.setPedDlcClothes(
                    ped,
                    component.dlc,
                    component.id,
                    component.drawable,
                    component.texture,
                    component.drawable,
                );
                continue;
            }

            native.setPedComponentVariation(
                ped,
                component.id,
                component.drawable,
                component.texture,
                component.palette ?? 0,
            );
        }

        updateCamera();
    }

    async function updateCamera() {
        if (!lastCameraOptions || !camera) {
            return;
        }

        await alt.Utils.waitFor(() => native.doesEntityExist(ped), 5000);

        native.pointCamAtPedBone(camera, ped, PedBones[lastCameraOptions.bone], 0, 0, 0, false);
    }

    async function createCamera(
        options: CameraOptions = {
            fov: 30,
            zOffset: 0.8,
            bone: 'IK_Head',
        },
    ) {
        if (camera) {
            return;
        }

        await alt.Utils.waitFor(() => typeof ped !== 'undefined' && native.doesEntityExist(ped), 5000);

        lastCameraOptions = options;

        const fwd = native.getEntityForwardVector(ped);
        const targetPosition = native.getEntityCoords(ped, true);
        const pos = targetPosition.add(fwd.x * 2, fwd.y * 2, options.zOffset);

        camera = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', pos.x, pos.y, pos.z, 0, 0, 0, 55, false, 1);

        native.setCamUseShallowDofMode(camera, true);
        native.setCamFov(camera, options.fov);
        native.setCamNearDof(camera, 0.2);
        native.setCamFarDof(camera, 3.5);
        native.setCamDofStrength(camera, 1);
        native.setCamActive(camera, true);

        native.pointCamAtPedBone(camera, ped, PedBones[options.bone], 0, 0, 0, false);
        native.renderScriptCams(true, true, 1000, false, false, 0);

        if (typeof interval === 'undefined') {
            interval = alt.setInterval(tick, 0);
        }
    }

    function destroyCamera() {
        alt.clearInterval(interval);
        interval = undefined;

        native.destroyAllCams(true);
        native.setCamActive(camera, false);
        native.renderScriptCams(false, false, 0, false, false, 0);
        camera = undefined;
    }

    return {
        ped: {
            destroy: destroyPed,
            get() {
                return ped;
            },
            update: updatePed,
        },
        camera: {
            create: createCamera,
            destroy: destroyCamera,
            get() {
                return camera;
            },
            update: updateCamera,
        },
    };
}
