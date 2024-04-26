export enum CreditAlignment {
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center',
}

export type Credit = {
    /**
     * Larger blue text to display.
     * CANNOT use GTA Colors like ~r~
     * @type {string}
     *
     */
    largeText: string;

    /**
     * Text below the role.
     * Can use GTA Colors.
     * @type {string}
     *
     */
    smallText: string;

    /**
     * How long should this display for in milliseconds.
     * Use -1 to set forever.
     * @type {number}
     *
     */
    duration: number;

    /**
     * The alignment of the credits. Defaults to left.
     * @type {CreditAlignment}
     *
     */
    align?: string | CreditAlignment;
};
