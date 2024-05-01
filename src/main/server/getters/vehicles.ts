import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';

export function useVehiclesGetter() {
    /**
     * Get all vehicles in range of a position
     *
     * @param {alt.IVector3} pos A position in the world.
     * @param {number} range
     * @return {alt.Vehicle[]}
     */
    function inRange(pos: alt.IVector3, range: number): alt.Vehicle[] {
        return alt.Vehicle.all.filter((x) => {
            if (!x.valid || !x.pos) {
                return false;
            }

            return Utility.vector.distance(x.pos, pos) <= range;
        });
    }

    return {
        inRange,
    };
}
