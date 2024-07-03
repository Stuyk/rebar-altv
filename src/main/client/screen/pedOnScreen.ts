import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';

const PAUSE_POSITIONS = {
    left: 0,
    middle: 1,
    right: 2,
};

let serverSideScreen: Awaited<ReturnType<typeof usePedOnScreen>>;

export async function usePedOnScreen(refPed: number, position: keyof typeof PAUSE_POSITIONS = 'middle') {
    const pausePosition = PAUSE_POSITIONS[position];
    let previousHudColor: alt.RGBA;
    let ped: number;
    let interval: number;
    let syncClothes = false;

    native.activateFrontendMenu(native.getHashKey('FE_MENU_VERSION_EMPTY_NO_BACKGROUND'), false, -1);
    ped = native.clonePed(refPed, false, false, false);
    native.setEntityCoordsNoOffset(
        ped,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z - 100,
        false,
        false,
        false,
    );

    await alt.Utils.waitFor(() => native.isFrontendReadyForControl());
    native.requestScaleformMovie('PAUSE_MP_MENU_PLAYER_MODEL');
    native.freezeEntityPosition(ped, true);
    native.setMouseCursorVisible(false);
    native.givePedToPauseMenu(ped, pausePosition);
    native.setPauseMenuPedLighting(true);
    native.setPauseMenuPedSleepState(true);
    native.fadeUpPedLight(4);

    const [_, r, g, b, a] = native.getHudColour(177);
    previousHudColor = new alt.RGBA(r, g, b, a);
    native.replaceHudColourWithRgba(117, 0, 0, 0, 0);

    const previousClothes = {};
    const previousProps = {};

    function tick() {
        native.setMouseCursorVisible(false);

        if (syncClothes) {
            if (!native.doesEntityExist(refPed)) {
                return;
            }

            for (let i = 0; i <= 11; i++) {
                const drawable = native.getPedDrawableVariation(refPed, i);
                const texture = native.getPedTextureVariation(refPed, i);
                const palette = native.getPedPaletteVariation(refPed, i);

                if (
                    previousClothes[i] &&
                    previousClothes[i].drawable === drawable &&
                    previousClothes[i].texture === texture
                ) {
                    continue;
                }

                previousClothes[i] = {
                    texture,
                    drawable,
                };

                native.setPedComponentVariation(ped, i, drawable, texture, palette);
            }

            const props = [0, 1, 2, 6, 7];
            for (let prop of props) {
                const drawable = native.getPedPropIndex(refPed, prop, 0);
                const texture = native.getPedPropTextureIndex(refPed, prop);

                if (
                    previousProps[prop] &&
                    previousProps[prop].drawable === drawable &&
                    previousProps[prop].texture === texture
                ) {
                    continue;
                }
                previousProps[prop] = {
                    texture,
                    drawable,
                };
                native.setPedPropIndex(ped, prop, drawable, texture, true, 0);
            }
        }
    }

    /**
     * Synchronizes player appearance to the menu ped
     *
     */
    function syncComponents() {
        syncClothes = true;
    }

    function close() {
        native.clearPedInPauseMenu();
        native.setFrontendActive(false);

        if (typeof interval !== 'undefined') {
            alt.clearInterval(interval);
            interval = undefined;
        }

        if (typeof ped !== 'undefined') {
            native.deleteEntity(ped);
            ped = undefined;
        }

        if (previousHudColor) {
            native.replaceHudColourWithRgba(
                117,
                previousHudColor.r,
                previousHudColor.g,
                previousHudColor.b,
                previousHudColor.a,
            );
        }
    }

    interval = alt.setInterval(tick, 100);

    return {
        close,
        syncComponents,
    };
}

alt.onServer(Events.player.screen.ped.show, async (value: boolean, position: string) => {
    if (value) {
        serverSideScreen = await usePedOnScreen(alt.Player.local.scriptID, position as keyof typeof PAUSE_POSITIONS);
        serverSideScreen.syncComponents();
    } else {
        serverSideScreen.close();
        serverSideScreen = undefined;
    }
});

alt.on('disconnect', () => {
    if (!serverSideScreen) {
        return;
    }

    serverSideScreen.close();
});
