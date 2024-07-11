import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '@Shared/events/index.js';
import { getStreetInfo, getZone } from '@Client/utility/world/index.js';


alt.onRpc(Events.systems.world.pointDetails, async (point: alt.Vector3) => {
    const { streetName, crossingRoad } = getStreetInfo(point);
    const zone = getZone(point);
    return { zone, streetName, crossingRoad };
});

alt.onRpc(Events.systems.world.travelDistance, async (point1: alt.Vector3, point2: alt.Vector3) => {
    return native.calculateTravelDistanceBetweenPoints(
        point1.x, point1.y, point1.z, point2.x, point2.y, point2.z
    )
});
