import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { useCharacter } from '@Server/document/character.js';

export function usePlayersGetter() {
    /**
     * Return all players currently online and logged into a character.
     *
     * @return {alt.Player[]}
     */
    function online(): alt.Player[] {
        return [...alt.Player.all].filter((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            return typeof data !== 'undefined';
        });
    }

    /**
     * Return all players with weapons out.
     *
     * @export
     * @return {alt.Player[]}
     */
    function onlineWithWeapons(): alt.Player[] {
        return [...alt.Player.all].filter((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            if (p.currentWeapon === 0xa2719263) {
                return false;
            }

            return true;
        });
    }

    /**
     * Creates an array of players who are closest to a position.
     * Array is automatically sorted into ascending order.
     *
     * @param {alt.IVector3} pos A position in the world.
     * @param {number} range
     * @return {Array<{ player: alt.Player; dist: number }>}
     */
    function inRangeWithDistance(pos: alt.IVector3, range: number): Array<{ player: alt.Player; dist: number }> {
        const playersInRange: Array<{ player: alt.Player; dist: number }> = [];
        const players = [...alt.Player.all];
        for (let player of players) {
            if (!player || !player.valid) {
                continue;
            }

            const document = useCharacter(player);
            const data = document.get();
            if (typeof data === 'undefined') {
                continue;
            }

            const dist = Utility.vector.distance(pos, player.pos);
            if (dist > range) {
                continue;
            }

            playersInRange.push({ player, dist });
        }

        return playersInRange.sort((a, b) => {
            return a.dist - b.dist;
        });
    }

    /**
     * Gets all players around a specific position.
     *
     * @param {alt.IVector3} pos A position in the world.
     * @param {number} range
     * @return {alt.Player[]}
     */
    function inRange(pos: alt.IVector3, range: number): alt.Player[] {
        const players = [...alt.Player.all].filter((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            return typeof data !== 'undefined';
        });

        if (players.length <= 0) {
            return [];
        }

        return players.filter((p) => p.pos && Utility.vector.distance(pos, p.pos) <= range);
    }

    /**
     * Gets all online players with a given name.
     *
     * @param {string} name
     * @return {alt.Player[]}
     */
    function withName(name: string): alt.Player[] {
        name = name.toLowerCase().replaceAll('_', ''); // Normalize My_Name to myname
        return alt.Player.all.filter((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            return data.name.toLowerCase().replaceAll('_', '') === name;
        });
    }

    /**
     * Returns all players who are currently driving a vehicle.
     *
     * @return {alt.Player[]}
     */
    function driving(): alt.Player[] {
        return alt.Player.all.filter((p) => {
            if (!p.valid || !p.vehicle || !p.vehicle.driver) {
                return false;
            }

            return p.vehicle.driver.id === p.id;
        });
    }

    /**
     * Return all players who are currently walking / on foot.
     *
     * @return {alt.Player[]}
     */
    function walking(): alt.Player[] {
        return alt.Player.all.filter((p) => {
            if (!p.valid || p.vehicle) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            return typeof data !== 'undefined';
        });
    }

    /**
     * Returns all passengers and the driver.
     * No specific order.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @return {alt.Player[]}
     */
    function inVehicle(vehicle: alt.Vehicle): alt.Player[] {
        return alt.Player.all.filter((x) => x.vehicle && x.vehicle.id === vehicle.id);
    }

    return { online, onlineWithWeapons, inRangeWithDistance, inRange, withName, driving, walking, inVehicle };
}
