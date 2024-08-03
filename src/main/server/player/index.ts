import * as alt from 'alt-server';
import { useAnimation } from './animation.js';
import { usePlayerAppearance } from './appearance.js';
import { useAudio } from './audio.js';
import { useClothing } from './clothing.js';
import { useNative } from './native.js';
import { useNotify } from './notify.js';
import { useState } from './state.js';
import { useStatus } from './status.js';
import { useWaypoint } from './waypoint.js';
import { useWeapon } from './weapon.js';
import { useWebview } from './webview.js';
import { useWorld } from './world.js';
import { useCharacter } from '../document/character.js';
import { usePlayerGetter } from '../getters/player.js';
import { useVehicleGetter } from '../getters/vehicle.js';
import { useRaycast } from './raycast.js';
import { useAccount } from '../document/account.js';
import { useScreenshot } from '../systems/screenshot.js';
import { useAttachment } from './attachment.js';
import { usePermissions } from '../systems/permissions/index.js';

const playerGetter = usePlayerGetter();
const vehicleGetter = useVehicleGetter();

export function usePlayer(player: alt.Player) {
    return {
        account: useAccount(player),
        animation: useAnimation(player),
        appearance: usePlayerAppearance(player),
        attachment: useAttachment(player),
        audio: useAudio(player),
        clothing: useClothing(player),
        character: useCharacter(player),
        get: {
            closestPlayer: () => {
                if (!player || !player.valid) {
                    return undefined;
                }

                return playerGetter.closestToPlayer(player);
            },
            closestVehicle: () => {
                if (!player || !player.valid) {
                    return undefined;
                }

                return vehicleGetter.closestVehicle(player);
            },
        },
        isValid: () => {
            return playerGetter.isValid(player);
        },
        native: useNative(player),
        notify: useNotify(player),
        player,
        raycast: useRaycast(player),
        screenshot: useScreenshot(player),
        sound: useAudio(player),
        state: useState(player),
        status: useStatus(player),
        waypoint: useWaypoint(player),
        weapon: useWeapon(player),
        webview: useWebview(player),
        world: useWorld(player),
        permissions: usePermissions(player),
    };
}
