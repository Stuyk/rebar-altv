import * as alt from 'alt-shared';

export const MarkerType = {
    UPSIDE_DOWN_CONE: 0,
    CYLINDER: 1,
    CHEVRON_UP: 2,
    THIN_CHEVRON_UP: 3,
    CHECKERED_FLAG: 4,
    CHECKERED_FLAG_CIRCLE: 5,
    VERTICLE_CIRCLE: 6,
    PLANE_MODEL: 7,
    LOST_MC: 8,
    LOST_MC_SOLID: 9,
    NUMBER_0: 10,
    NUMBER_1: 11,
    NUMBER_2: 12,
    NUMBER_3: 13,
    NUMBER_4: 14,
    NUMBER_5: 15,
    NUMBER_6: 16,
    NUMBER_7: 17,
    NUMBER_8: 18,
    NUMBER_9: 19,
    CHEVRON_UP_SINGLE: 20,
    CHEVRON_UP_DOUBLE: 21,
    CHEVRON_UP_TRIPLE: 22,
    FLAT_CIRCLE: 23,
    REPLAY: 24,
    FLAT_CIRCLE_SKINNY: 25,
    FLAT_CIRCLE_SKINNY_DIRECTIONAL: 26,
    FLAT_CIRCLE_SKINNY_SPLIT: 27,
    SPHERE: 28,
    DOLLAR_SIGN: 29,
    HORIZONTAL_BARS: 30,
    WOLF_HEAD: 31,
    QUESTION: 32,
    PLANE: 33,
    HELICOPTER: 34,
    BOAT: 35,
    CAR: 36,
    MOTORCYCLE: 37,
    BIKE: 38,
    TRUCK: 39,
    PARACHUTE: 40,
    JETPACK: 41,
    SAW_BLADE: 42,
    FLAT_VERTICAL_GRADIENT: 43,
};

export type MarkerBase = {
    uid?: string;
    pos: alt.IVector3;
    scale: alt.IVector3;
    color: alt.RGBA;
    dimension?: number;
};

export type Marker = {
    type: number | keyof typeof MarkerType;
} & MarkerBase;
