import * as alt from 'alt-server';
import * as players from './players.js';
import * as Utility from '@Shared/utility/index.js';
import { useVehicle } from '@Server/document/vehicle.js';

export function useVehicleGetter() {
    /**
     * Get a vehicle by their alt:V ID
     *
     * @param {number} id
     * @return {(alt.Vehicle | undefined)}
     */
    function byAltvId(id: number): alt.Vehicle | undefined {
        return alt.Vehicle.all.find((x) => x.id === id);
    }

    /**
     * Get a vehicle by database id, or id
     *
     * @param {(string | number)} id
     * @return {(alt.Vehicle | undefined)}
     */
    function byId(id: string | number): alt.Vehicle | undefined {
        return alt.Vehicle.all.find((x) => {
            const document = useVehicle(x);
            const data = document.get();

            if (typeof data === 'undefined') {
                return false;
            }

            if (typeof id === 'number' && data.id === id) {
                return true;
            }

            if (data._id !== id) {
                return false;
            }

            return true;
        });
    }

    /**
     * Get a vehicle based on their database _id
     * May return undefined if the vehicle is not currently spawned.
     *
     * @deprecated
     * @param {string} id
     * @return {(alt.Vehicle | undefined)}
     */
    function byDatabaseID(id: string): alt.Vehicle | undefined {
        return byId(id);
    }

    /**
     * Check if a vehicle model is currently valid.
     * Use `alt.hash` to hash a plain text model. ex: `alt.hash('infernus')`
     *
     * @param {number} model
     * @return {boolean}
     */
    function isValidModel(model: number): boolean {
        try {
            const vehicle = new alt.Vehicle(model, 0, 0, 0, 0, 0, 0);
            alt.nextTick(() => {
                vehicle.destroy();
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Check if a vehicle with a given _id is already spawned
     *
     * @param {string} _id
     */
    function isSpawned(_id: string) {
        return byDatabaseID(_id) ? true : false;
    }

    /**
     * Checks if a vehicle is within 3 distance of a position.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @param {alt.IVector3} pos A position in the world.
     */
    function isNearPosition(vehicle: alt.Vehicle, pos: alt.IVector3, dist = 3): boolean {
        return Utility.vector.distance(vehicle.pos, pos) <= dist;
    }

    /**
     * Returns all passengers and the driver.
     * No specific order.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @return {alt.Player[]}
     */
    function passengers(vehicle: alt.Vehicle): alt.Player[] {
        const playersGetter = players.usePlayersGetter();
        return playersGetter.inVehicle(vehicle);
    }

    /**
     * Just wraps the `vehicle.driver` lookup.
     * Returns a player if they are driving this vehicle.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @return {(alt.Player | undefined)}
     */
    function driver(vehicle: alt.Vehicle): alt.Player | undefined {
        return vehicle.driver;
    }

    /**
     * Returns the closest vehicle to the player within a given range.
     *
     * Starts off 2 distance in front of the player.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {number} range How far away to look
     * @return {(alt.Vehicle | undefined)}
     */
    function closestVehicle(player: alt.Player, range = 25): alt.Vehicle | undefined {
        const results = alt.Utils.getClosestVehicle({ pos: player.pos, range }) as alt.Vehicle;
        return results ? results : undefined;
    }

    return {
        byAltvId,
        byId,
        byDatabaseID,
        closestVehicle,
        driver,
        isValidModel,
        isNearPosition,
        isSpawned,
        passengers,
    };
}
