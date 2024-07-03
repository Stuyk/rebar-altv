import { FemaleTops } from './femaleTops.js';
import { FemaleTorsos } from './femaleTorsos.js';
import { FemaleUndershirtCategories } from './femaleUndershirtCategories.js';
import { MaleTops } from './maleTops.js';
import { MaleTorsos } from './maleTorsos.js';
import { MaleUndershirtCategories } from './maleUndershirtCategories.js';

const DefaultList = {
    Male: {
        clothes: {
            '1': 8,
            '2': 18,
            '3': 16,
            '4': 16,
            '5': 9,
            '6': 16,
            '8': 16,
            '11': 16,
        },
        props: {},
    },
    Female: {
        clothes: {
            '1': 8,
            '2': 18,
            '3': 17,
            '4': 16,
            '5': 9,
            '6': 16,
            '8': 16,
            '11': 16,
        },
        props: {},
    },
};

// Updated June 19, 2024
const ClothingList = {
    Female_Apt01: {
        clothes: {
            '1': 1,
            '4': 13,
            '6': 6,
            '7': 4,
            '8': 4,
            '9': 3,
            '11': 26,
        },
        props: {
            '0': 2,
        },
    },
    Female_freemode_beach: {
        clothes: {
            '2': 2,
            '4': 2,
            '6': 1,
            '7': 2,
            '8': 2,
            '11': 3,
        },
        props: {
            '0': 3,
            '1': 2,
        },
    },
    Female_freemode_business: {
        clothes: {
            '1': 3,
            '2': 2,
            '4': 2,
            '6': 2,
            '7': 1,
            '8': 3,
            '11': 6,
        },
        props: {
            '0': 2,
            '1': 2,
            '6': 1,
        },
    },
    Female_freemode_business2: {
        clothes: {
            '8': 1,
            '11': 1,
        },
        props: {},
    },
    Female_freemode_Halloween: {
        clothes: {
            '1': 13,
        },
        props: {},
    },
    Female_freemode_hipster: {
        clothes: {
            '1': 4,
            '2': 2,
            '4': 3,
            '6': 2,
            '7': 2,
            '8': 4,
            '11': 8,
        },
        props: {
            '0': 2,
            '1': 2,
        },
    },
    Female_freemode_independence: {
        clothes: {
            '1': 6,
            '2': 1,
            '4': 1,
            '6': 1,
            '8': 1,
            '9': 1,
            '11': 2,
        },
        props: {
            '0': 7,
            '1': 2,
        },
    },
    Female_freemode_mpLTS: {
        clothes: {
            '1': 3,
            '3': 2,
            '4': 1,
            '5': 10,
            '9': 1,
            '10': 1,
            '11': 2,
        },
        props: {
            '0': 1,
        },
    },
    Female_freemode_Pilot: {
        clothes: {
            '1': 1,
            '3': 1,
            '4': 1,
            '5': 11,
            '6': 1,
            '7': 1,
            '9': 1,
            '11': 1,
        },
        props: {
            '0': 1,
        },
    },
    Female_freemode_valentines: {
        clothes: {
            '1': 3,
            '2': 1,
            '3': 1,
            '4': 4,
            '6': 1,
            '7': 1,
            '8': 3,
            '11': 3,
        },
        props: {},
    },
    female_heist: {
        clothes: {
            '1': 24,
            '2': 1,
            '3': 92,
            '4': 11,
            '5': 12,
            '6': 5,
            '7': 10,
            '8': 13,
            '9': 3,
            '10': 2,
            '11': 18,
        },
        props: {
            '0': 9,
            '1': 1,
            '2': 3,
        },
    },
    Female_xmas: {
        clothes: {
            '1': 3,
            '4': 1,
            '6': 1,
            '8': 2,
            '11': 2,
        },
        props: {
            '0': 3,
        },
    },
    Female_xmas2: {
        clothes: {
            '1': 4,
            '4': 1,
            '5': 10,
            '7': 2,
            '11': 2,
        },
        props: {
            '0': 6,
        },
    },
    mp_f_2023_01: {
        clothes: {
            '1': 10,
            '2': 1,
            '3': 1,
            '4': 22,
            '6': 12,
            '7': 9,
            '8': 7,
            '9': 1,
            '10': 33,
            '11': 61,
        },
        props: {
            '0': 8,
            '1': 6,
            '7': 1,
        },
    },
    mp_f_2023_02: {
        clothes: {
            '1': 11,
            '2': 1,
            '3': 3,
            '4': 16,
            '6': 12,
            '7': 3,
            '8': 8,
            '9': 4,
            '10': 18,
            '11': 31,
        },
        props: {
            '0': 19,
            '1': 3,
        },
    },
    mp_f_airraces_01: {
        clothes: {
            '1': 1,
            '4': 3,
            '6': 1,
            '8': 1,
            '10': 2,
            '11': 5,
        },
        props: {
            '0': 1,
        },
    },
    mp_f_assault: {
        clothes: {
            '4': 1,
            '11': 1,
        },
        props: {},
    },
    mp_f_battle: {
        clothes: {
            '1': 1,
            '4': 5,
            '6': 3,
            '8': 16,
            '11': 21,
        },
        props: {
            '0': 2,
        },
    },
    mp_f_bikerdlc_01: {
        clothes: {
            '1': 1,
            '2': 7,
            '3': 24,
            '4': 7,
            '5': 8,
            '6': 9,
            '8': 19,
            '9': 1,
            '10': 30,
            '11': 34,
        },
        props: {
            '0': 13,
            '1': 2,
            '6': 8,
            '7': 8,
        },
    },
    mp_f_christmas2017: {
        clothes: {
            '1': 12,
            '4': 6,
            '6': 8,
            '7': 4,
            '8': 10,
            '10': 13,
            '11': 14,
        },
        props: {
            '0': 6,
            '1': 1,
        },
    },
    mp_f_christmas2018: {
        clothes: {
            '1': 14,
            '3': 4,
            '4': 13,
            '5': 11,
            '6': 14,
            '7': 3,
            '8': 7,
            '10': 1,
            '11': 18,
        },
        props: {
            '0': 6,
            '1': 1,
        },
    },
    mp_f_christmas3: {
        clothes: {
            '1': 7,
            '2': 1,
            '3': 1,
            '4': 13,
            '6': 17,
            '7': 13,
            '8': 2,
            '10': 14,
            '11': 33,
        },
        props: {
            '0': 14,
            '1': 5,
            '6': 2,
            '7': 3,
        },
    },
    mp_f_executive_01: {
        clothes: {
            '4': 2,
            '6': 2,
            '7': 2,
            '8': 6,
            '11': 17,
        },
        props: {
            '0': 2,
        },
    },
    mp_f_g9ec: {
        clothes: {
            '4': 1,
            '6': 1,
            '8': 1,
            '10': 3,
            '11': 1,
        },
        props: {},
    },
    mp_f_gunrunning_01: {
        clothes: {
            '1': 6,
            '3': 36,
            '4': 5,
            '6': 5,
            '8': 30,
            '10': 6,
            '11': 27,
        },
        props: {
            '0': 8,
        },
    },
    mp_f_gunrunning_hair_01: {
        clothes: {
            '2': 39,
        },
        props: {},
    },
    mp_f_heist3: {
        clothes: {
            '1': 20,
            '4': 6,
            '5': 4,
            '6': 1,
            '7': 3,
            '8': 14,
            '9': 3,
            '10': 14,
            '11': 22,
        },
        props: {
            '0': 12,
        },
    },
    mp_f_heist4: {
        clothes: {
            '1': 5,
            '3': 11,
            '4': 2,
            '5': 4,
            '6': 2,
            '7': 15,
            '8': 9,
            '10': 1,
            '11': 11,
        },
        props: {
            '0': 3,
            '1': 4,
            '6': 1,
            '7': 1,
        },
    },
    mp_f_htb_01: {
        clothes: {
            '1': 1,
            '3': 1,
            '11': 1,
        },
        props: {},
    },
    mp_f_importexport_01: {
        clothes: {
            '1': 12,
            '3': 16,
            '4': 9,
            '6': 2,
            '8': 13,
            '10': 3,
            '11': 22,
        },
        props: {
            '0': 7,
        },
    },
    mp_f_january2016: {
        clothes: {
            '3': 13,
            '4': 1,
            '5': 10,
            '7': 1,
            '9': 13,
            '11': 1,
        },
        props: {
            '0': 5,
            '1': 1,
        },
    },
    mp_f_lowrider_01: {
        clothes: {
            '2': 4,
            '4': 1,
            '6': 2,
            '7': 2,
            '8': 7,
            '10': 1,
            '11': 9,
        },
        props: {
            '0': 2,
            '2': 3,
        },
    },
    mp_f_lowrider_02: {
        clothes: {
            '2': 3,
            '4': 2,
            '6': 2,
            '7': 5,
            '8': 6,
            '11': 10,
        },
        props: {
            '2': 2,
        },
    },
    mp_f_luxe_01: {
        clothes: {
            '4': 1,
            '6': 2,
            '7': 24,
            '8': 12,
            '9': 2,
            '11': 5,
        },
        props: {
            '2': 10,
            '6': 4,
        },
    },
    mp_f_luxe_02: {
        clothes: {
            '4': 1,
            '7': 28,
            '11': 3,
        },
        props: {
            '0': 1,
            '6': 4,
            '7': 7,
        },
    },
    mp_f_security: {
        clothes: {
            '1': 3,
            '2': 1,
            '3': 1,
            '4': 6,
            '8': 12,
            '9': 1,
            '10': 12,
            '11': 15,
        },
        props: {
            '0': 8,
            '1': 6,
        },
    },
    mp_f_smuggler_01: {
        clothes: {
            '1': 11,
            '6': 2,
            '8': 3,
            '9': 7,
            '10': 2,
            '11': 7,
        },
        props: {
            '0': 9,
        },
    },
    mp_f_stunt_01: {
        clothes: {
            '1': 1,
            '3': 2,
            '4': 5,
            '6': 4,
            '8': 5,
            '10': 4,
            '11': 10,
        },
        props: {
            '0': 16,
        },
    },
    mp_f_sum: {
        clothes: {
            '1': 5,
            '3': 19,
            '4': 6,
            '8': 6,
            '10': 1,
            '11': 23,
        },
        props: {
            '0': 1,
        },
    },
    mp_f_sum2: {
        clothes: {
            '1': 11,
            '2': 2,
            '3': 1,
            '4': 5,
            '5': 11,
            '6': 7,
            '7': 2,
            '8': 2,
            '10': 4,
            '11': 25,
        },
        props: {
            '0': 9,
            '1': 2,
            '2': 1,
            '6': 4,
            '7': 1,
        },
    },
    mp_f_sum2_g9ec: {
        clothes: {
            '1': 5,
            '4': 2,
            '6': 1,
            '8': 1,
            '10': 1,
            '11': 9,
        },
        props: {
            '0': 8,
            '2': 1,
            '6': 1,
            '7': 1,
        },
    },
    mp_f_tuner: {
        clothes: {
            '1': 6,
            '2': 1,
            '3': 1,
            '4': 5,
            '5': 11,
            '6': 4,
            '7': 1,
            '8': 6,
            '10': 39,
            '11': 19,
        },
        props: {
            '0': 3,
        },
    },
    mp_f_valentines_02: {
        clothes: {
            '4': 2,
            '6': 2,
            '8': 1,
            '11': 6,
        },
        props: {},
    },
    mp_f_vinewood: {
        clothes: {
            '1': 12,
            '2': 1,
            '3': 1,
            '4': 4,
            '6': 4,
            '8': 2,
            '9': 13,
            '10': 2,
            '11': 22,
        },
        props: {
            '0': 2,
            '1': 2,
            '2': 4,
            '6': 10,
        },
    },
    mp_f_xmas_03: {
        clothes: {
            '1': 15,
            '3': 1,
            '4': 2,
            '6': 1,
            '11': 2,
        },
        props: {},
    },
    Male_Apt01: {
        clothes: {
            '1': 1,
            '4': 13,
            '6': 6,
            '7': 4,
            '8': 4,
            '9': 3,
            '11': 25,
        },
        props: {
            '0': 2,
        },
    },
    Male_freemode_beach: {
        clothes: {
            '2': 2,
            '4': 3,
            '6': 1,
            '7': 2,
            '8': 3,
            '11': 2,
        },
        props: {
            '0': 2,
            '1': 1,
            '6': 1,
        },
    },
    Male_freemode_business: {
        clothes: {
            '1': 3,
            '2': 2,
            '4': 2,
            '6': 2,
            '7': 5,
            '8': 6,
            '11': 6,
        },
        props: {
            '0': 2,
            '1': 2,
            '6': 1,
        },
    },
    Male_freemode_business2: {
        clothes: {
            '4': 2,
            '7': 4,
            '8': 6,
            '9': 1,
            '11': 4,
        },
        props: {},
    },
    Male_freemode_Halloween: {
        clothes: {
            '1': 13,
        },
        props: {},
    },
    Male_freemode_hipster: {
        clothes: {
            '1': 4,
            '2': 2,
            '4': 3,
            '6': 2,
            '7': 2,
            '8': 12,
            '11': 12,
        },
        props: {
            '0': 3,
            '1': 2,
            '6': 1,
        },
    },
    Male_freemode_independence: {
        clothes: {
            '1': 6,
            '2': 1,
            '4': 1,
            '7': 1,
            '8': 6,
            '11': 3,
        },
        props: {
            '0': 7,
            '1': 2,
        },
    },
    Male_freemode_mpLTS: {
        clothes: {
            '1': 3,
            '3': 2,
            '4': 1,
            '5': 10,
            '9': 1,
            '10': 1,
            '11': 2,
        },
        props: {
            '0': 1,
        },
    },
    Male_freemode_Pilot: {
        clothes: {
            '1': 1,
            '3': 1,
            '4': 1,
            '5': 11,
            '6': 1,
            '7': 1,
            '11': 1,
        },
        props: {
            '0': 1,
        },
    },
    Male_freemode_valentines: {
        clothes: {
            '1': 3,
            '4': 2,
            '6': 2,
            '7': 1,
            '8': 4,
            '11': 3,
        },
        props: {
            '0': 1,
        },
    },
    Male_Heist: {
        clothes: {
            '1': 24,
            '2': 1,
            '3': 78,
            '4': 9,
            '5': 12,
            '6': 3,
            '7': 6,
            '8': 10,
            '9': 1,
            '10': 2,
            '11': 17,
        },
        props: {
            '0': 9,
            '2': 3,
        },
    },
    Male_xmas: {
        clothes: {
            '1': 3,
            '4': 1,
            '6': 1,
            '7': 2,
            '8': 2,
            '11': 2,
        },
        props: {
            '0': 3,
        },
    },
    Male_xmas2: {
        clothes: {
            '1': 4,
            '4': 1,
            '5': 10,
            '7': 2,
            '11': 2,
        },
        props: {
            '0': 6,
        },
    },
    mp_m_2023_01: {
        clothes: {
            '1': 10,
            '2': 2,
            '3': 1,
            '4': 17,
            '6': 9,
            '7': 8,
            '8': 6,
            '9': 1,
            '10': 28,
            '11': 53,
        },
        props: {
            '0': 8,
            '1': 6,
            '7': 1,
        },
    },
    mp_m_2023_02: {
        clothes: {
            '1': 11,
            '2': 1,
            '3': 3,
            '4': 16,
            '6': 10,
            '7': 3,
            '8': 8,
            '9': 4,
            '10': 19,
            '11': 29,
        },
        props: {
            '0': 19,
            '1': 3,
        },
    },
    mp_m_airraces_01: {
        clothes: {
            '1': 1,
            '4': 3,
            '6': 1,
            '8': 1,
            '10': 2,
            '11': 5,
        },
        props: {
            '0': 1,
        },
    },
    mp_m_assault: {
        clothes: {
            '4': 1,
            '11': 1,
        },
        props: {},
    },
    mp_m_battle: {
        clothes: {
            '1': 1,
            '4': 2,
            '6': 3,
            '8': 6,
            '11': 17,
        },
        props: {
            '0': 2,
        },
    },
    mp_m_bikerdlc_01: {
        clothes: {
            '1': 1,
            '2': 6,
            '3': 24,
            '4': 7,
            '5': 8,
            '6': 7,
            '8': 16,
            '10': 21,
            '11': 29,
        },
        props: {
            '0': 13,
            '1': 2,
            '6': 8,
            '7': 8,
        },
    },
    mp_m_christmas2017: {
        clothes: {
            '1': 12,
            '4': 5,
            '6': 7,
            '7': 4,
            '8': 10,
            '10': 12,
            '11': 13,
        },
        props: {
            '0': 6,
            '1': 1,
        },
    },
    mp_m_christmas2018: {
        clothes: {
            '1': 14,
            '3': 4,
            '4': 13,
            '5': 11,
            '6': 14,
            '7': 3,
            '8': 6,
            '10': 1,
            '11': 18,
        },
        props: {
            '0': 6,
            '1': 1,
        },
    },
    mp_m_christmas3: {
        clothes: {
            '1': 7,
            '3': 12,
            '4': 12,
            '6': 17,
            '7': 13,
            '8': 2,
            '10': 12,
            '11': 29,
        },
        props: {
            '0': 14,
            '1': 5,
            '6': 2,
            '7': 3,
        },
    },
    mp_m_executive_01: {
        clothes: {
            '4': 2,
            '6': 2,
            '7': 2,
            '8': 5,
            '11': 18,
        },
        props: {
            '0': 2,
        },
    },
    mp_m_g9ec: {
        clothes: {
            '4': 1,
            '6': 1,
            '8': 1,
            '10': 3,
            '11': 1,
        },
        props: {},
    },
    mp_m_gunrunning_01: {
        clothes: {
            '1': 6,
            '3': 28,
            '4': 5,
            '6': 5,
            '8': 10,
            '10': 6,
            '11': 21,
        },
        props: {
            '0': 8,
        },
    },
    mp_m_gunrunning_hair_01: {
        clothes: {
            '2': 37,
        },
        props: {},
    },
    mp_m_heist3: {
        clothes: {
            '1': 20,
            '4': 7,
            '5': 4,
            '6': 1,
            '7': 3,
            '8': 14,
            '9': 3,
            '10': 14,
            '11': 18,
        },
        props: {
            '0': 12,
        },
    },
    mp_m_heist4: {
        clothes: {
            '1': 5,
            '3': 11,
            '4': 2,
            '5': 4,
            '6': 2,
            '7': 15,
            '8': 8,
            '10': 1,
            '11': 11,
        },
        props: {
            '0': 3,
            '1': 4,
            '6': 1,
            '7': 1,
        },
    },
    male_heist: {
        clothes: {
            '1': 24,
            '2': 1,
            '3': 78,
            '4': 9,
            '5': 12,
            '6': 3,
            '7': 6,
            '8': 10,
            '9': 1,
            '10': 2,
            '11': 17,
        },
        props: {
            '0': 9,
            '2': 3,
        },
    },
    mp_m_htb_01: {
        clothes: {
            '1': 1,
            '3': 1,
            '11': 1,
        },
        props: {},
    },
    mp_m_importexport_01: {
        clothes: {
            '1': 12,
            '4': 8,
            '6': 2,
            '8': 1,
            '10': 3,
            '11': 20,
        },
        props: {
            '0': 7,
        },
    },
    mp_m_january2016: {
        clothes: {
            '3': 11,
            '4': 1,
            '5': 10,
            '7': 2,
            '9': 12,
            '11': 1,
        },
        props: {
            '0': 5,
            '1': 1,
        },
    },
    mp_m_lowrider_01: {
        clothes: {
            '2': 4,
            '4': 2,
            '6': 2,
            '7': 2,
            '10': 1,
            '11': 11,
        },
        props: {
            '0': 2,
        },
    },
    mp_m_lowrider_02: {
        clothes: {
            '2': 3,
            '4': 2,
            '6': 3,
            '7': 4,
            '11': 8,
        },
        props: {},
    },
    mp_m_luxe_01: {
        clothes: {
            '6': 2,
            '7': 32,
            '8': 4,
            '9': 1,
            '11': 6,
        },
        props: {
            '2': 18,
            '6': 8,
        },
    },
    mp_m_luxe_02: {
        clothes: {
            '6': 1,
            '7': 36,
            '11': 3,
        },
        props: {
            '2': 16,
            '6': 8,
        },
    },
    mp_m_security: {
        clothes: {
            '1': 3,
            '2': 1,
            '3': 1,
            '4': 6,
            '8': 5,
            '9': 1,
            '10': 10,
            '11': 11,
        },
        props: {
            '0': 8,
            '1': 6,
        },
    },
    mp_m_smuggler_01: {
        clothes: {
            '1': 11,
            '6': 2,
            '8': 13,
            '9': 9,
            '10': 2,
            '11': 9,
        },
        props: {
            '0': 9,
        },
    },
    mp_m_stunt_01: {
        clothes: {
            '1': 1,
            '3': 2,
            '4': 5,
            '6': 4,
            '8': 3,
            '10': 4,
            '11': 10,
        },
        props: {
            '0': 16,
        },
    },
    mp_m_sum: {
        clothes: {
            '1': 5,
            '3': 15,
            '4': 4,
            '8': 5,
            '10': 1,
            '11': 19,
        },
        props: {
            '0': 1,
        },
    },
    mp_m_sum2: {
        clothes: {
            '1': 11,
            '2': 2,
            '3': 1,
            '4': 4,
            '5': 11,
            '6': 7,
            '7': 2,
            '8': 2,
            '10': 4,
            '11': 20,
        },
        props: {
            '0': 9,
            '1': 2,
            '2': 1,
            '6': 4,
            '7': 1,
        },
    },
    mp_m_sum2_g9ec: {
        clothes: {
            '1': 5,
            '4': 2,
            '6': 1,
            '8': 1,
            '10': 1,
            '11': 8,
        },
        props: {
            '0': 8,
            '2': 1,
            '6': 1,
            '7': 1,
        },
    },
    mp_m_tuner: {
        clothes: {
            '1': 5,
            '2': 1,
            '3': 1,
            '4': 5,
            '5': 11,
            '6': 4,
            '7': 1,
            '8': 6,
            '10': 40,
            '11': 20,
        },
        props: {
            '0': 3,
        },
    },
    mp_m_valentines_02: {
        clothes: {
            '4': 2,
            '6': 1,
            '7': 1,
            '11': 2,
        },
        props: {
            '0': 1,
        },
    },
    mp_m_vinewood: {
        clothes: {
            '1': 12,
            '2': 1,
            '3': 1,
            '4': 5,
            '6': 4,
            '7': 1,
            '8': 7,
            '9': 15,
            '10': 2,
            '11': 24,
        },
        props: {
            '0': 2,
            '1': 2,
            '2': 4,
            '6': 10,
        },
    },
    mp_m_xmas_03: {
        clothes: {
            '1': 15,
            '3': 1,
            '4': 2,
            '6': 1,
            '11': 2,
        },
        props: {},
    },
    mp_f_2024_01: {
        clothes: {
            '1': 7,
            '4': 10,
            '6': 5,
            '7': 14,
            '8': 6,
            '10': 14,
            '11': 23,
        },
        props: {
            '0': 7,
            '1': 3,
            '6': 2,
            '7': 2,
        },
    },
    mp_m_2024_01: {
        clothes: {
            '1': 7,
            '4': 9,
            '6': 6,
            '7': 14,
            '8': 6,
            '10': 14,
            '11': 20,
        },
        props: {
            '0': 7,
            '1': 3,
            '6': 2,
            '7': 2,
        },
    },
};

/**
 * Add a category during runtime
 *
 * @export
 * @param {string} dlcName
 * @param {{ clothes: { [key: string]: number }, props: { [key: string]: number }}} data
 */
export function addCategory(
    dlcName: string,
    data: { clothes: { [key: string]: number }; props: { [key: string]: number } },
) {
    ClothingList[dlcName] = data;
}

/**
 * Get all categories for the given data
 *
 * @export
 * @param {boolean} isMale
 * @return
 */
export function getCategories(type: 'male' | 'female') {
    return [
        ...Object.keys(ClothingList).filter((key) => {
            if (type === 'male') {
                if (key.toLowerCase().includes('mp_m') || key.includes('Male_')) {
                    return true;
                }

                return false;
            }

            if (key.toLowerCase().includes('mp_f') || key.includes('Female_')) {
                return true;
            }

            return false;
        }),
        type === 'male' ? 'mp_m_0' : 'mp_f_0',
    ];
}

/**
 * Get a default category data, meaning non-dlc content. These are small but necessary sections.
 *
 * Mostly useful for torsos
 *
 * @export
 * @param {('male' | 'female')} type
 * @return
 */
export function getDefaultCategory(type: 'male' | 'female') {
    return type === 'male' ? DefaultList.Male : DefaultList.Female;
}

/**
 * Get category data, returns `undefined` if category does not exist
 *
 * @export
 * @param {string} category
 * @return {({ clothes: { [key: string]: number }; props: { [key: string]: number } } | undefined)}
 */
export function getCategory(
    category: string,
): { clothes: { [key: string]: number }; props: { [key: string]: number } } | undefined {
    return ClothingList[category];
}

/**
 * Get all tops for a given model
 *
 * @export
 * @param {('male' | 'female')} type
 * @return
 */
export function getTops(type: 'male' | 'female') {
    return type === 'male' ? MaleTops : FemaleTops;
}

/**
 * Get torsos from a given top torsos list
 *
 * @export
 * @param {('male' | 'female')} type
 * @param {number[]} values
 * @return
 */
export function getTorsos(type: 'male' | 'female', values: number[]) {
    let torsos: { dlc: string; drawable: number }[] = [];

    if (type === 'male') {
        for (let value of values) {
            torsos = torsos.concat(MaleTorsos[value]);
        }
    } else {
        for (let value of values) {
            torsos = torsos.concat(FemaleTorsos[value]);
        }
    }

    return torsos;
}

/**
 * Get all undershirts for a given category, and player model type
 *
 * @export
 * @param {('male' | 'female')} type
 * @param {('empty' | 'monster' | 'none' | 'open' | 'partial' | 'vest')} category
 * @return
 */
export function getUndershirts(
    type: 'male' | 'female',
    category: 'empty' | 'monster' | 'none' | 'open' | 'partial' | 'vest',
) {
    return type === 'male' ? MaleUndershirtCategories[category] : FemaleUndershirtCategories[category];
}
