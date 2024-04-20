import * as alt from 'alt-server';
import * as Utility from '../../shared/utility/index.js';
import { useAccount, useCharacter } from '@Server/document/index.js';

export function usePlayerGetter() {
    /**
     * Gets an online player by account identifier based on their MongoDB account _id.
     *
     *
     * #### Example
     * ```ts
     * const player = Athena.getters.player.byAccount('123456789');
     * if (player) {
     *     console.log(`Found player ${player.id} with account ID ${player.account._id}`);
     * } else {
     *    console.log('No player found with that account ID');
     * }
     * ```
     *
     * @param {string} id
     * @return {(alt.Player | undefined)}
     */
    function byAccount(id: string): alt.Player | undefined {
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useAccount(p);
            const accountData = document.get();
            if (typeof accountData === 'undefined') {
                return false;
            }

            if (accountData._id !== id) {
                return false;
            }

            return true;
        });
    }

    /**
     * Gets an online player by their name.
     *
     * Not case sensitive and returns the first player it finds matching that name.
     *
     * #### Example
     * ```ts
     * const player = Athena.getters.player.byName('john_fettermanjoe');
     * if (player) {
     *     console.log(`Found player ${player.id} with name ${player.name}`);
     * } else {
     *     console.log('No player found with that name');
     * }
     * ```
     *
     * @param {string} name
     * @return {(alt.Player | undefined)}
     */
    function byName(name: string): alt.Player | undefined {
        name = name.toLowerCase().replace(/\s|_+/g, ''); // Normalize 'John_Fetterman Joe' to 'john_fettermanjoe'
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            return data.name.toLowerCase().replace(/\s|_+/g, '') === name;
        });
    }

    /**
     * Gets an online player by their partial name.
     *
     * Not case sensitive and returns the first player it finds that includes the partial
     *
     * #### Example
     * ```ts
     * const partialName = 'john';
     * const player = Athena.getters.player.byPartialName(partialName);
     *
     * if (player) {
     *     console.log(`Found player ${player.id} with name ${player.name}`);
     * } else {
     *     console.log(`No player found with the partial name '${partialName}'`);
     * }
     * ```
     *
     * @param {string} partialName
     * @return {(alt.Player | undefined)}
     */
    function byPartialName(partialName: string): alt.Player | undefined {
        partialName = partialName.toLowerCase().replace(/\s|_+/g, ''); // Normalize 'John_Fetterman Joe' to 'john_fettermanjoe'
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            return data.name.toLowerCase().replace(/\s|_+/g, '').includes(partialName);
        });
    }

    /**
     * Get an online player based on their MongoDB _id
     *
     * #### Example
     * ```ts
     * const id = 'abc123jkfewfwe';
     * const player = Athena.getters.player.byCharacter(id);
     *
     * if (player) {
     *     console.log(`Found player with id ${id}`);
     * } else {
     *     console.log(`No player found with the id '${id}'`);
     * }
     * ```
     *
     * @param {string} id
     * @return {(alt.Player | undefined)}
     */
    function byCharacter(id: string): alt.Player | undefined {
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            return data._id === id;
        });
    }

    /**
     * Creates a temporary ColShape in front of the player.
     * The ColShape is then used to check if the entity is present within the ColShape.
     * It will keep subtract distance until it finds a player near the player that is in the ColShape.
     * Works best on flat land or very close distances.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {number} [startDistance=2]
     * @return {(alt.Player | undefined)}
     */
    async function inFrontOf(player: alt.Player, startDistance = 6): Promise<alt.Player | undefined> {
        const fwdVector = Utility.vector.getForwardVector(player.rot);
        const closestPlayers = [...alt.Player.all].filter((p) => {
            if (p.id === player.id) {
                return false;
            }

            const dist = Utility.vector.distance2d(player.pos, p.pos);
            if (dist > startDistance) {
                return false;
            }

            return true;
        });

        if (closestPlayers.length <= 0) {
            return undefined;
        }

        while (startDistance > 1) {
            for (const target of closestPlayers) {
                const fwdPos = {
                    x: player.pos.x + fwdVector.x * startDistance,
                    y: player.pos.y + fwdVector.y * startDistance,
                    z: player.pos.z - 1,
                };

                const colshape = new alt.ColshapeSphere(fwdPos.x, fwdPos.y, fwdPos.z, 2);

                await alt.Utils.wait(10);

                const isInside = colshape.isEntityIn(target);
                colshape.destroy();

                if (isInside) {
                    return target;
                }
            }

            startDistance -= 0.5;
        }

        return undefined;
    }

    /**
     * Checks if a player is within 3 distance of a position.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @param {alt.IVector3} pos A position in the world.
     */
    function isNearPosition(player: alt.Player, pos: alt.IVector3, dist = 3): boolean {
        return Utility.vector.distance(player.pos, pos) <= dist;
    }

    /**
     * The player closest to a player.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @return {(alt.Player | undefined)}
     */
    function closestToPlayer(player: alt.Player): alt.Player | undefined {
        const players = [...alt.Player.all].filter((target) => {
            if (!target || !target.valid) {
                return false;
            }

            const document = useCharacter(target);
            if (typeof document === 'undefined') {
                return false;
            }

            if (target.id === player.id) {
                return false;
            }

            return true;
        });

        return Utility.vector.getClosestOfType<alt.Player>(player.pos, players);
    }

    // /**
    //  * Get the current waypoint marked on a player's map.
    //  * Will return undefined it is not currently set.
    //  *
    //  * @param {alt.Player} player An alt:V Player Entity
    //  * @return {(alt.IVector3 | undefined)}
    //  */
    // export function waypoint(player: alt.Player): alt.IVector3 | undefined {
    //     return player.currentWaypoint;
    // }

    /**
     * The player closest to a vehicle.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @return {(alt.Player | undefined)}
     */
    function closestToVehicle(vehicle: alt.Vehicle): alt.Player | undefined {
        const players = [...alt.Player.all].filter((target) => {
            if (!target || !target.valid) {
                return false;
            }

            const document = useCharacter(target);
            if (typeof document === 'undefined') {
                return false;
            }

            return true;
        });

        return Utility.vector.getClosestOfType<alt.Player>(vehicle.pos, players);
    }

    /**
     * Determine if a player is valid, and spawned as a character.
     *
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @return {boolean}
     */
    function isValid(player: alt.Player): boolean {
        if (!player || !player.valid) {
            return false;
        }

        const data = useCharacter(player);
        if (typeof data === 'undefined') {
            return false;
        }

        return true;
    }

    return {
        byAccount,
        byCharacter,
        byName,
        byPartialName,
        closestToPlayer,
        closestToVehicle,
        inFrontOf,
        isNearPosition,
        isValid,
    };
}
