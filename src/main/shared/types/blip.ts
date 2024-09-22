import * as alt from 'alt-shared';
import { BlipNames } from '../data/blipNames.js';

export const BlipColor = {
    WHITE_1: 0,
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    WHITE_2: 4,
    YELLOW: 5,
    LIGHT_RED: 6,
    VIOLET: 7,
    PINK: 8,
    LIGHT_ORANGE: 9,
    LIGHT_BROWN: 10,
    LIGHT_GREEN: 11,
    LIGHT_BLUE: 12,
    LIGHT_PURPLE: 13,
    DARK_PURPLE: 14,
    CYAN: 15,
    LIGHT_YELLOW: 16,
    ORANGE: 17,
    LIGHT_BLUE_2: 18,
    DARK_PINK: 19,
    DARK_YELLOW: 20,
    DARK_ORANGE: 21,
    LIGHT_GRAY: 22,
    LIGHT_PINK: 23,
    LEMON_GREEN: 24,
    FOREST_GREEN: 25,
    ELECTRIC_BLUE: 26,
    BRIGHT_PURPLE: 27,
    DARK_YELLOW_2: 28,
    DARK_BLUE: 29,
    DARK_CYAN: 30,
    LIGHT_BROWN_2: 31,
    LIGHT_BLUE_3: 32,
    LIGHT_YELLOW_2: 33,
    LIGHT_PINK_2: 34,
    LIGHT_RED_2: 35,
    BEIGE: 36,
    WHITE_3: 37,
    BLUE_2: 38,
    LIGHT_GRAY_2: 39,
    DARK_GRAY: 40,
    PINK_RED: 41,
    BLUE_3: 42,
    LIGHT_GREEN_2: 43,
    LIGHT_ORANGE_2: 44,
    WHITE_4: 45,
    GOLD: 46,
    ORANGE_2: 47,
    BRILLIANT_ROSE: 48,
    RED_2: 49,
    MEDIUM_PURPLE: 50,
    SALMON: 51,
    DARK_GREEN: 52,
    BLIZZARD_BLUE: 53,
    ORACLE_BLUE: 54,
    SILVER: 55,
    BROWN: 56,
    BLUE_4: 57,
    EAST_BAY: 58,
    RED_3: 59,
    YELLOW_ORANGE: 60,
    MULBERRY_PINK: 61,
    ALTO_GRAY: 62,
    JELLY_BEAN_BLUE: 63,
    DARK_ORANGE_2: 64,
    MAMBA: 65,
    YELLOW_ORANGE_2: 66,
    BLUE_5: 67,
    BLUE_6: 68,
    GREEN_2: 69,
    YELLOW_ORANGE_3: 70,
    YELLOW_ORANGE_4: 71,
    TRANSPARENT_BLACK: 72,
    YELLOW_ORANGE_5: 73,
    BLUE_7: 74,
    RED_4: 75,
    DEEP_RED: 76,
    BLUE_8: 77,
    ORACLE_BLUE_2: 78,
    TRANSPARENT_RED: 79,
    TRANSPARENT_BLUE: 80,
    ORANGE_3: 81,
    LIGHT_GREEN_3: 82,
    PURPLE: 83,
    BLUE_9: 84,
    TRANSPARENT_BLACK_2: 85,
};

export type Blip = {
    /**
     * Another identifier field for the blip.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The 3D position of the blip on the map.
     * @type {Vector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Set this to true if you don't want it on the map all of the time.
     * @type {boolean}
     *
     */
    shortRange?: boolean;

    /**
     * The blip appearance which is known as a 'sprite'.
     * Do not use `1` as it can have side effects.
     * https://docs.fivem.net/docs/game-references/blips/
     * @type {number}
     *
     */
    sprite: number | keyof typeof BlipNames;

    /**
     * The color of this
     * @type {number}
     *
     */
    color: number | keyof typeof BlipColor;

    /**
     * The text / name of this blip. Can be whatever.
     * @type {string}
     *
     */
    text: string;

    /**
     * The scale of this blip.
     * @type {number}
     *
     */
    scale?: number;

    /**
     * What dimension to place this blip in.
     *
     * @type {number}
     */
    dimension?: number;

    /**
     * Another identifier field for the blip.
     * 1 = No Text on blip or Distance
     * 2 = Text on blip
     * 3 = No text, just distance
     * 7 = Other players %name% (%distance%)
     * 10 = Property
     * 11 = Occupied property
     * 12+ No Text on blip or distance
     * @type {number}
     *
     */
    category?: number;

    /**
     * The color of a route.
     *
     * @type {number}
     */
    routeColor?: alt.RGBA;
};
