import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';
import { Weathers } from '@Shared/data/weathers.js';

const DEFAULT_TIME = { hour: 8, minute: 0, second: 0 };
const DEFAULT_WEATHER: Weathers = 'EXTRASUNNY';
const DEFAULT_WEATHER_FORECAST: Weathers[] = ['EXTRASUNNY', 'CLOUDS', 'RAIN', 'THUNDER', 'CLOUDS', 'CLEARING'];

export interface TimeService {
    /**
     * Set the current hour in the server
     *
     * @memberof TimeService
     */
    setHour: (hour: number) => void;

    /**
     * Set the current minute in the server
     *
     * @memberof TimeService
     */
    setMinute: (minute: number) => void;

    /**
     * Set the current second in the server
     *
     * @memberof TimeService
     */
    setSecond: (second: number) => void;
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
        timeChanged: (hour: number, minute: number, second: number) => void;
        timeSecondChanged: (minute: number) => void;
        timeMinuteChanged: (minute: number) => void;
        timeHourChanged: (hour: number) => void;
    }
}

export function useTimeService() {
    return {
        setHour(hour: number) {
            if (hour >= 24) {
                hour = 0;
            }

            const service = useServiceRegister().get('timeService');
            if (service.setHour) {
                service.setHour(hour);
            }

            const time = alt.hasMeta('serverTime') ? alt.getMeta('serverTime') : DEFAULT_TIME;
            time.hour = hour;
            alt.setMeta('serverTime', time);
            alt.emit('timeHourChanged', hour);
        },
        setMinute(minute: number) {
            if (minute >= 60) {
                minute = 0;
            }

            const service = useServiceRegister().get('timeService');
            if (service.setMinute) {
                service.setMinute(minute);
            }

            const time = alt.hasMeta('serverTime') ? alt.getMeta('serverTime') : DEFAULT_TIME;
            time.minute = minute;
            alt.setMeta('serverTime', time);
            alt.emit('timeMinuteChanged', minute);
            alt.emit('timeChanged', time.hour, time.minute, time.second);
        },
        setSecond(second: number) {
            if (second >= 60) {
                second = 0;
            }

            const service = useServiceRegister().get('timeService');
            if (service.setSecond) {
                service.setSecond(second);
            }

            const time = alt.hasMeta('serverTime') ? alt.getMeta('serverTime') : DEFAULT_TIME;
            time.second = second;
            alt.setMeta('serverTime', time);
            alt.emit('timeSecondChanged', second);
            alt.emit('timeChanged', time.hour, time.minute, time.second);
        },
        getTime() {
            return alt.getMeta('serverTime');
        },
    };
}

alt.setMeta('serverTime', DEFAULT_TIME);
alt.setMeta('serverWeather', DEFAULT_WEATHER);
alt.setMeta('serverWeatherForecast', DEFAULT_WEATHER_FORECAST);
