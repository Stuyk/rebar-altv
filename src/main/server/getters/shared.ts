import * as alt from 'alt-server';
import { distance2d, getForwardVector } from '../../shared/utility/vector.js';

export function getClosestEntity<T extends alt.Entity>(entity: alt.Entity, entities: T[], range = 25) {
    const fwdVector = getForwardVector(entity.rot);
    const position = {
        x: entity.pos.x + fwdVector.x * 1,
        y: entity.pos.y + fwdVector.y * 1,
        z: entity.pos.z - 1,
    };

    let closestTarget: T;
    let lastDistance = range;

    for (let target of entities) {
        const dist = distance2d(position, target.pos);
        if (dist > range) {
            continue;
        }

        // Ignore same types, with same ids
        if (entity.type === target.type && target.id === entity.id) {
            continue;
        }

        if (dist > lastDistance) {
            continue;
        }

        lastDistance = dist;
        closestTarget = target;
    }

    return closestTarget;
}
