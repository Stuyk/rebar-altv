/**
 * dlc information for given clothing data
 */
export type ClothingComponent = {
    /**
     * The component identifier
     *
     * @type {number}
     *
     */
    id: number;

    /**
     * The associated relative drawing id for a given dlc clothing component
     *
     * @type {number}
     *
     */
    drawable: number;

    /**
     *
     *
     * @type {number}
     *
     */
    texture: number;

    /**
     *
     *
     * @type {number}
     *
     */
    palette?: number;

    /**
     *
     *
     * @type {number}
     *
     */
    dlc: number;

    /**
     *
     *
     * @type {boolean}
     *
     */
    isProp?: boolean;
};
