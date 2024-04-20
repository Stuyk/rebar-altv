import * as alt from 'alt-shared';
import { Appearance } from './appearance.js';
import { ClothingComponent } from './clothingComponent.js';

/**
 * Used as the main interface for storing character data.
 *
 *
 * @interface Character
 */
export type Character = {
    /**
     * The character identifier in the database.
     * @type {*}
     *
     */
    _id?: string;

    /**
     * The account id associated with this character.
     * @type {*}
     *
     */
    account_id: string;

    /**
     * The current dimension of the player. When they spawn
     * they are automatically moved into this dimension.
     *
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * The position that this character last logged out at.
     * This also updates every 5s or so.
     * @type {Partial<alt.IVector3>}
     *
     */
    pos?: Partial<alt.IVector3>;

    /**
     * The name of this character to display to other users.
     * @type {string}
     *
     */
    name?: string;

    /**
     * The amount of cash this character has.
     * @type {number}
     *
     */
    cash?: number;

    /**
     * The amount of cash in the bank this character has.
     * @type {number}
     *
     */
    bank?: number;

    /**
     * The amount of health the player last had.
     * @type {number} 99 - 199
     *
     */
    health?: number;

    /**
     * The amount of armour the player last had.
     * @type {number} 0 - 100
     *
     */
    armour?: number;

    /**
     * The amount of food the player has.
     * @type {number} 0 - 100
     *
     */
    food?: number;

    /**
     * The amount of water the player has.
     * @type {number}
     *
     */
    water?: number;

    /**
     * Is this player dead or not.
     * Health does not dictate whether a player is alive or dead.
     * @type {boolean}
     *
     */
    isDead?: boolean;

    /**
     * Amount of hours the player has played.
     * @type {number}
     *
     */
    hours?: number;

    /**
     * Appearance data for how this character looks.
     * @type {Partial<Appearance>}
     *
     */
    appearance?: Partial<Appearance> | Appearance;

    /**
     * Current player interior number. Usually bound to dimension.
     *
     * @type {(number | undefined)}
     *
     */
    interior?: number | undefined;

    /**
     * Permissions for a given user.
     *
     * @type {Array<string>}
     *
     */
    permissions?: Array<string>;

    /**
     * Clothes that will be applied to the player last.
     * Uniforms should be used in tandem with typical inventory clothing.
     *
     * @type {Array<ClothingComponent>}
     *
     */
    clothing?: Array<ClothingComponent>;

    /**
     * Clothes that will be applied to the player last.
     * Uniforms should be used in tandem with typical inventory clothing.
     *
     * @type {Array<ClothingComponent>}
     *
     */
    uniform?: Array<ClothingComponent>;

    /**
     * A custom model that can be applied to the player.
     * If this is set; the clothing items will never be applied.
     * This also goes for appearance as well.
     *
     * @type {(string | number)}
     *
     */
    skin?: string | number;

    /**
     * A key value pair that contains a list of permissions a character has for a group.
     *
     * @type {{ [key: string]: Array<string> }}
     * @memberof Character
     */
    groups?: { [key: string]: Array<string> };
};
