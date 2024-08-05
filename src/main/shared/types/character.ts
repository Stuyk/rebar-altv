import * as alt from 'alt-shared';
import { Appearance } from './appearance.js';
import { ClothingComponent } from './clothingComponent.js';
import {GroupsDocumentMixin, PermissionsDocumentMixin} from "@Shared/types/index.js";

export interface BaseCharacter {
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
     * @type {alt.IVector3}
     *
     */
    pos?: alt.IVector3;

    /**
     * The rotation that this character last logged out at.
     *
     * @type {alt.IVector3}
     */
    rot?: alt.IVector3;

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
     * Is this player dead or not.
     * Health does not dictate whether a player is alive or dead.
     * @type {boolean}
     *
     */
    isDead?: boolean;
}

/**
 * Used as the main interface for storing character data.
 *
 *
 * @interface Character
 */
export interface Character extends BaseCharacter, PermissionsDocumentMixin, GroupsDocumentMixin {
    /**
     * The character identifier in the database.
     * @type {*}
     *
     */
    _id?: string;

    /**
     * An easy to use identifier for the character
     *
     * @type {number}
     * @memberof Character
     */
    id?: number;

    /**
     * The account id associated with this character.
     * @type {*}
     *
     */
    account_id: string;

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
     * Player weapons that the player currently has equipped
     *
     * @type {(alt.IWeapon & { ammo: number })[]}
     */
    weapons?: (alt.IWeapon & { ammo: number })[];
}
