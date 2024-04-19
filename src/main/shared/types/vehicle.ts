import * as alt from 'alt-shared';

/**
 * Used as the main describer of a stored vehicle.
 *
 *
 * @interface Vehicle
 */
export interface Vehicle {
    /**
     * The vehicle identifier for the database.
     * Also used to save to the database.
     * @type {*}
     *
     */
    _id?: string;

    /**
     * The player who is the owner of this vehicle.
     * Corresponds with character._id or null if it belongs to anything else
     * Obviously permissions and keys should be used if no owner is set.
     *
     * @type {string}
     *
     */
    owner: string | null;

    /**
     * The model of this vehicle.
     * @type {string}
     *
     */
    model: string;

    /**
     * The last position where this vehicle was last left.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The last rotation where this vehicle was last left.
     * @type {alt.IVector3}
     *
     */
    rot: alt.IVector3;

    /**
     * Used to control what dimension this vehicle should spawn in / be found in
     * @type {string}
     *
     */
    dimension: number;

    /**
     * A list of character ids that have access to this vehicle
     *
     * @type {Array<string>}
     *
     */
    keys: Array<string>;

    /**
     * The fuel level for this vehicle.
     *
     * @type {number}
     *
     */
    fuel: number;
}
