import * as alt from 'alt-server';

const DEFAULT_TIME = { hour: 8, minute: 0, second: 0 };

export interface TimeService {
    /**
     * Set the current time in-game for the server
     *
     * @memberof TimeService
     */
    setTime: (hour: number, minute: number, second: number) => void;
}

declare global {
    interface RebarServices {
        timeService: TimeService;
    }
}

declare module 'alt-server' {
    export interface ICustomGlobalMeta {
        serverTime: { hour: number; minute: number; second: number };
    }

    export interface ICustomEmitEvent {
        'rebar:timeChanged': (hour: number, minute: number, second: number) => void;
        'rebar:timeSecondChanged': (minute: number) => void;
        'rebar:timeMinuteChanged': (minute: number) => void;
        'rebar:timeHourChanged': (hour: number) => void;
    }
}

export function useTimeService() {
    return {
        setTime(hour: number, minute: number, second: number) {
            if (hour >= 24 || hour < 0) {
                hour = 0;
            }

            if (minute >= 60 || minute < 0) {
                minute = 0;
            }

            if (second >= 60 || second < 0) {
                second = 0;
            }

            const time = alt.hasMeta('serverTime') ? alt.getMeta('serverTime') : DEFAULT_TIME;

            if (time.hour !== hour) {
                alt.emit('rebar:timeHourChanged', hour);
            }

            if (time.minute !== minute) {
                alt.emit('rebar:timeMinuteChanged', minute);
            }

            if (time.second !== second) {
                alt.emit('rebar:timeSecondChanged', second);
            }

            time.hour = hour;
            time.minute = minute;
            time.second = second;
            alt.setMeta('serverTime', time);
            alt.emit('rebar:timeChanged', time.hour, time.minute, time.second);
        },
        getTime() {
            return alt.getMeta('serverTime');
        },
    };
}

alt.setMeta('serverTime', DEFAULT_TIME);
