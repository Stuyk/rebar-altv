import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import { useAccount, useCharacter } from '@Server/document/index.js';

export function usePlayerGetter() {
    /**
     * Gets an online player by account identifier based on their MongoDB account _id.
     *
     *
     * #### Example
     * ```ts
     * const player = Rebar.get.usePlayerGetter().byAccount('123456789');
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
    function byAccount(id: string | number): alt.Player | undefined {
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useAccount(p);
            const accountData = document.get();
            if (typeof accountData === 'undefined') {
                return false;
            }

            if (typeof id === 'number' && accountData.id === id) {
                return true;
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
    function byCharacter(id: string | number): alt.Player | undefined {
        return alt.Player.all.find((p) => {
            if (!p.valid) {
                return false;
            }

            const document = useCharacter(p);
            const data = document.get();
            if (typeof data === 'undefined') {
                return false;
            }

            if (typeof id === 'number' && data.id === id) {
                return true;
            }

            return data._id === id;
        });
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
    function closestToPlayer(player: alt.Player, range = 10): alt.Player | undefined {
        const results = alt.Utils.getClosestPlayer({ pos: player.pos, range }) as alt.Player;
        return results ? results : undefined;
    }

    /**
     * The player closest to a vehicle.
     *
     * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
     * @return {(alt.Player | undefined)}
     */
    function closestToVehicle(vehicle: alt.Vehicle, range = 25): alt.Player | undefined {
        const results = alt.Utils.getClosestPlayer({ pos: vehicle.pos, range }) as alt.Player;
        return results ? results : undefined;
    }

    /**
     * Determine if a player is valid, and spawned as a character.
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
        isNearPosition,
        isValid,
    };
}
