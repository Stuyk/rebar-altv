import * as alt from 'alt-shared';

/**
 * Used to describe a dxgi text label. Passed from server to client.
 *
 * @interface D2DTextLabel
 */
export interface D2DTextLabel {
    /**
     * The unique identifier to remove this text label if necessary.
     * @type {string}
     *
     */
    uid?: string;

    /**
     *
     *
     * @type {string}
     * @memberof D2DTextLabel
     */
    font?: string;

    /**
     * The position where to place the TextLabel in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Rotation of the Text Label
     *
     * @type {alt.IVector3}
     * @memberof D2DTextLabel
     */
    rot?: alt.IVector3;

    /**
     * The 'Text' to show on this text label.
     * @type {string}
     *
     */
    text: string;

    /**
     * The dimension to show this text label in.
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * Recommended to leave this alone
     *
     * @type {number}
     * @memberof D2DTextLabel
     */
    fontSize?: number;

    /**
     * Scale font size with this instead
     *
     * @type {number}
     * @memberof D2DTextLabel
     */
    fontScale?: number;

    fontOutline?: number;

    fontColor?: alt.RGBA;

    fontOutlineColor?: alt.RGBA;
}
