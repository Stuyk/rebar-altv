import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';

/**
 * Sends an event to the server when the local player's waypoint is updated.
 * @static
 * @return {void}
 */
export async function returnWaypoint() {
    const waypoint = native.getFirstBlipInfoId(8);
    const coords = native.getBlipInfoIdCoord(waypoint);

    if (!native.doesBlipExist(waypoint) || !coords) {
        return undefined;
    }

    const foundWaypoint: alt.IVector3 = await new Promise(async (resolve: Function) => {
        let startingZPosition = 0;

        for (let i = 0; i < 100; i++) {
            await new Promise(async (resolve: Function) => {
                native.newLoadSceneStartSphere(
                    coords.x,
                    coords.y,
                    coords.z ?? native.getApproxHeightForPoint(coords.x, coords.y),
                    2,
                    1,
                );
                await alt.Utils.waitFor(() => native.isNewLoadSceneActive() && native.isNewLoadSceneLoaded());
                resolve();
            });

            native.newLoadSceneStop();

            native.requestCollisionAtCoord(coords.x, coords.y, coords.z);
            native.setFocusPosAndVel(coords.x, coords.y, startingZPosition, 0, 0, 0);

            const [isValid, zPos] = native.getGroundZFor3dCoord(coords.x, coords.y, startingZPosition, 0, false, false);

            if (!isValid) {
                startingZPosition += 25;
                continue;
            }

            if (startingZPosition >= 1500) {
                resolve(undefined);
                return;
            }

            native.clearFocus();
            resolve({ x: coords.x, y: coords.y, z: zPos });
            return;
        }
    });

    return foundWaypoint;
}

alt.onRpc(Events.systems.waypoint.get, returnWaypoint);
