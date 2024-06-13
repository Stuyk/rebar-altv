import * as alt from 'alt-shared';

export interface ProgressBar {
    uid?: string;

    /**
     * Set the dimension to see this progress bar in.
     *
     * Optional, but defaults to 0
     *
     * @type {number}
     * @memberof ProgressBar
     */
    dimension?: number;

    /**
     * The label to show for this progress bar
     *
     * @type {string}
     * @memberof ProgressBar
     */
    label: string;

    /**
     * Current value
     *
     * @type {number}
     * @memberof ProgressBar
     */
    value: number;

    /**
     * Maximum value for this progress bar
     *
     * If using it as a timer, this is the max value in `seconds`
     *
     * @type {number}
     * @memberof ProgressBar
     */
    maxValue: number;

    /**
     * Position for where to put the progress bar in-world
     *
     * @type {alt.IVector3}
     * @memberof ProgressBar
     */
    pos: alt.IVector3;
}
