export enum SpinnerType {
    CLOCKWISE_WHITE_0 = 0,
    CLOCKWISE_WHITE_1 = 1,
    CLOCKWISE_WHITE_2 = 2,
    CLOCKWISE_WHITE_3 = 3,
    CLOCKWISE_YELLOW = 4,
    COUNTER_CLOCKWISE_WHITE = 5,
}

export type Spinner = {
    duration: number;
    text: string;
    type: SpinnerType;
};
