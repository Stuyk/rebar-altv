import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';
import { getDirectionFromRotation } from '../utility/math/index.js';

type ReturnTypes = {
    player: alt.Player;
    vehicle: alt.Vehicle;
    object: alt.Object;
};

let everyTick;
let start: alt.Vector3;
let end: alt.Vector3;

function drawDebugLines() {
    if (!start || !end) {
        return;
    }

    native.drawLine(start.x, start.y, start.z, end.x, end.y, end.z, 255, 0, 0, 255);
}

function performRaycast(flags: number = -1, debug = false) {
    start = alt.getCamPos();
    const forwardVector = getDirectionFromRotation(native.getFinalRenderedCamRot(2));
    end = new alt.Vector3(
        start.x + forwardVector.x * 500,
        start.y + forwardVector.y * 500,
        start.z + forwardVector.z * 500,
    );

    if (debug && typeof everyTick === 'undefined') {
        everyTick = alt.everyTick(drawDebugLines);
    }

    const raycast = native.startExpensiveSynchronousShapeTestLosProbe(
        start.x,
        start.y,
        start.z,
        end.x,
        end.y,
        end.z,
        flags,
        alt.Player.local,
        4,
    );

    const [result, didHit, coords, coords2, entity] = native.getShapeTestResult(raycast);
    return { result, didHit, coords, coords2, entity };
}

export function useRaycast() {
    /**
     * Find an entity the player is looking at
     *
     * @template K
     * @param {K} type
     * @return {ReturnTypes[K]}
     */
    function getFocusedEntity<K extends keyof ReturnTypes>(type: K, debug = false): ReturnTypes[K] {
        const results = performRaycast(-1, debug);
        if (!results.result || !results.didHit) {
            return undefined;
        }

        if (type === 'player') {
            return alt.Player.all.find((x) => x.scriptID === results.entity) as ReturnTypes[K];
        }

        if (type === 'vehicle') {
            return alt.Vehicle.all.find((x) => x.scriptID === results.entity) as ReturnTypes[K];
        }

        if (type === 'object') {
            return alt.Object.all.find((x) => x.scriptID === results.entity) as ReturnTypes[K];
        }

        return undefined;
    }



    /**
     * Get the object the player is looking at
     *
     * @return {{ pos: alt.Vector3; id: number; model: number, entityPos: alt.Vector3 }}
     */
    function getFocusedObject(debug = false): {
        pos: alt.Vector3;
        scriptId: number;
        model: number;
        entityPos: alt.Vector3;
    } {
        const results = performRaycast(16, debug);
        if (!results.result || !results.didHit) {
            return undefined;
        }

        const entityPos = native.getEntityCoords(results.entity, false);
        return {
            pos: results.coords,
            scriptId: results.entity,
            model: native.getEntityModel(results.entity),
            entityPos,
        };
    }

    /**
     * Get the position the player is looking at
     *
     * @return {alt.Vector3}
     */
    function getFocusedPosition(debug = false): alt.Vector3 {
        const results = performRaycast(-1, debug);
        if (!results.result || !results.didHit) {
            return undefined;
        }

        return results.coords;
    }

    function getFocusedCustom(flag: number, debug = false) {
        const results = performRaycast(flag, debug);
        if (!results.result || !results.didHit) {
            return undefined;
        }
        const type = native.getEntityType(results.entity);
        const entityPos = native.getEntityCoords(results.entity, false);

        return {
            scriptId: results.entity,
            type,
            pos: results.coords,
            entityPos,
        };
    }

    return {
        getFocusedEntity,
        getFocusedObject,
        getFocusedPosition,
        getFocusedCustom,
    };
}

const raycast = useRaycast();

alt.onRpc(Events.systems.raycast.getFocusedEntity, raycast.getFocusedEntity);
alt.onRpc(Events.systems.raycast.getFocusedObject, raycast.getFocusedObject);
alt.onRpc(Events.systems.raycast.getFocusedPosition, raycast.getFocusedPosition);
alt.onRpc(Events.systems.raycast.getFocusedCustom, raycast.getFocusedCustom);
