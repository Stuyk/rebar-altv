import * as alt from 'alt-shared';

export type iObject = {
    /**
     * A unique identifier for this object.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * Use this parameter to help you identify what this item does on client-side.

     * @type  { [key: string]: any }
     *
     */
    data?: { [key: string]: any };

    /**
     * Position of the Object in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The model hash for this object.
     * @type {number}
     *
     */
    model: number;

    /**
     * The rotation of this object.
     * @type {alt.IVector3}
     *
     */
    rot?: alt.IVector3;

    /**
     * Will show across all dimensions.
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * Should this object have no collision?
     * @type {boolean}
     *
     */
    noCollision?: boolean;
};
