import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '@Shared/events/index.js';
import { ClothingComponent } from '@Shared/types/clothingComponent.js';
import { Appearance } from '@Shared/types/appearance.js';

alt.on('gameEntityCreate', (entity) => {
    if (!(entity instanceof alt.Ped)) {
        return;
    }

    if (entity.getStreamSyncedMeta('makeStupid')) {
        native.disablePedPainAudio(entity, true);
    }

    if (entity.getStreamSyncedMeta('invincible')) {
        native.setEntityInvincible(entity, true);
    }
});

alt.everyTick(() => {
    for (let ped of alt.Ped.streamedIn) {
        if (ped.getStreamSyncedMeta('makeStupid')) {
            native.setPedCanRagdoll(ped, false);
            native.setBlockingOfNonTemporaryEvents(ped, true);
        }
        native.setPedResetFlag(ped, 458, true);
        native.setPedResetFlag(ped, 64, true);
        native.setPedResetFlag(ped, 249, true);
    }
});

async function invoke(nativeName: string, ...args: any[]) {
    if (nativeName === 'taskPlayAnim') {
        const [ped, dict, name, enterPlayback, exitPlayback, duration, flag, rate, lockX, lockY, lockZ] = args;

        await alt.Utils.requestAnimDict(args[1]);

        for (let i = 0; i < 64; i++) {
            await alt.Utils.wait(500);

            if (native.isEntityPlayingAnim(ped, dict, name, 3)) {
                break;
            }

            native[nativeName](ped, dict, name, enterPlayback, exitPlayback, duration, flag, rate, lockX, lockY, lockZ);
        }

        return;
    }

    native[nativeName](...args);
}

async function invokeRpc(nativeName: string, ...args: any[]) {
    return native[nativeName](...args);
}

async function fadeOut(ped: alt.Ped) {
    let alphaValue = 255;

    while (alphaValue > 0) {
        if (!ped || !ped.valid) {
            return;
        }

        alphaValue -= 7;
        if (alphaValue <= 25) {
            native.setEntityAlpha(ped, 0, false);
            break;
        }

        native.setEntityAlpha(ped, alphaValue, false);
        await alt.Utils.wait(100);
    }
}

function setAppearance(ped: alt.Ped, clothing: ClothingComponent[], appearance: Appearance) {
    let pedId = ped.scriptID;
    native.clearPedDecorations(ped);
    native.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    native.setPedHeadBlendData(
        ped,
        appearance.faceFather,
        appearance.faceMother,
        0,
        appearance.skinFather,
        appearance.skinMother,
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
                alt.setPedDlcProp(pedId, component.dlc, component.id, component.drawable, component.texture);
                continue;
            }

            native.setPedPropIndex(ped, component.id, component.drawable, component.texture, true, 0);
            continue;
        }

        if (component.dlc != 0) {
            alt.setPedDlcClothes(
                pedId,
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
}

alt.onServer(Events.controllers.ped.fadeOut, fadeOut);
alt.onServer(Events.controllers.ped.invoke, invoke);
alt.onServer(Events.controllers.ped.setAppearance, setAppearance);
alt.onRpc(Events.controllers.ped.invokeRpc, invokeRpc);
