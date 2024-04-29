import * as alt from 'alt-shared';

export interface Option {
    /**
     * Text to display on this menu entry.
     *
     * @type {string}
     * @memberof Option
     */
    text: string;

    /**
     * An identifier associated with this menu entry
     *
     * @type {string}
     * @memberof Option
     */
    id?: string;

    /**
     * An event name to call when invoking this menu entry.
     *
     * @type {string}
     * @memberof Option
     */
    callback?: Function;
}

export interface TextInput extends Option {
    type: 'input';
    value: string;
}

export interface Invoke extends Option {
    type: 'invoke';
    value: string | number | Object;
    isPageChanger?: boolean;
    leftCallback?: Function;
    rightCallback?: Function;
}

export interface Selection extends Option {
    type: 'selection';
    options: { text: string; value: string | number | Object }[];
    index: number;
}

export interface Color extends Option {
    type: 'color';
    options: { text: string; color: alt.RGBA; value: any }[];
    index: number;
}

export interface ColorGroup {
    default: alt.RGBA;
    hover: alt.RGBA;
}

export type NativeMenu = {
    header: string;
    options: Array<TextInput | Invoke | Selection | Color>;

    /**
     * An event to call when 'backspace' is pressed.
     *
     * @type {string}
     * @memberof Menu
     */
    backCallback?: Function;

    /**
     * If this is set to true, it will prevent the user from fully exiting the menu.
     *
     * @type {boolean}
     * @memberof Menu
     */
    noExit?: boolean;
};
