export interface RebarBaseItem {
    /**
     * A general purpose item identifier.
     *
     * Used for things like `food-burger`
     *
     * @type {keyof RebarItems}
     */
    id: keyof RebarItems;

    /**
     * The unique name of the item
     *
     * @type {string}
     */
    name: string;

    /**
     * The description of the item
     *
     * @type {string}
     */
    desc: string;

    /**
     * The maximum amount of items that can exist in this stack of items
     *
     * @type {number}
     */
    maxStack: number;

    /**
     * Weight per item, this is not the total weight.
     *
     * You'll want to do `quantity * weight` to see the total weight of the stack.
     *
     * @type {number}
     */
    weight: number;

    /**
     * Icon for the item with extension
     *
     * ie. `icon-burger.png`
     *
     * @type {string}
     */
    icon: string;
}

export type Item = {
    /**
     * A unique string that is attached to the item.
     *
     * @type {string}
     */
    uid: string;

    /**
     * The number of items in the stack of items
     *
     * @type {number}
     */
    quantity: number;

    /**
     * Any custom data that belongs to the item
     *
     * @type {{ [key: string]: any }}
     */
    data?: { [key: string]: any };
} & RebarBaseItem;
