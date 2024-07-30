import * as alt from 'alt-server';
import { useServices } from './index.js';
import { Weathers } from '../../shared/data/weathers.js';

const DEFAULT_TIME = { hour: 8, minute: 0, second: 0 };
const DEFAULT_WEATHER: Weathers = 'EXTRASUNNY';
const DEFAULT_WEATHER_FORECAST: Weathers[] = ['EXTRASUNNY', 'CLOUDS', 'RAIN', 'THUNDER', 'CLOUDS', 'CLEARING'];

export interface WorldService {
    /**
     * Set the current hour in the server
     *
     * @memberof WorldService
     */
    setHour: (hour: number) => void;

    /**
     * Set the current minute in the server
     *
     * @memberof WorldService
     */
    setMinute: (minute: number) => void;

    /**
     * Set the current second in the server
     *
     * @memberof WorldService
     */
    setSecond: (second: number) => void;

    /**
     * Set the current weather for a player
     *
     * @memberof WorldService
     */
    setWeather: (type: Weathers) => void;

    /**
     * Set the current weather forecast
     *
     * @memberof WorldService
     */
    setWeatherForecast: (type: Weathers[]) => void;
}

declare global {
    interface RebarServices {
        worldService: WorldService;
    }
}

declare module 'alt-server' {
    export interface ICustomGlobalMeta {
        serverTime: { hour: number; minute: number; second: number };
        serverWeather: Weathers;
        serverWeatherForecast: Weathers[];
    }

    export interface ICustomEmitEvent {
        weatherForecastChanged: (weather: Weathers[]) => void;
        weatherChanged: (weather: Weathers) => void;
        timeChanged: (hour: number, minute: number, second: number) => void;
        timeSecondChanged: (minute: number) => void;
        timeMinuteChanged: (minute: number) => void;
        timeHourChanged: (hour: number) => void;
    }
}

export function useWorldService(): WorldService {
    return {
        setHour(hour: number) {
            if (hour >= 24) {
                hour = 0;
            }

            const services = useServices().get('worldService');
            for (let service of services) {
                if (typeof service.setHour !== 'function') {
                    continue;
                }

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

            const services = useServices().get('worldService');
            for (let service of services) {
                if (typeof service.setMinute !== 'function') {
                    continue;
                }

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

            const services = useServices().get('worldService');
            for (let service of services) {
                if (typeof service.setSecond !== 'function') {
                    continue;
                }

                service.setSecond(second);
            }

            const time = alt.hasMeta('serverTime') ? alt.getMeta('serverTime') : DEFAULT_TIME;
            time.second = second;
            alt.setMeta('serverTime', time);
            alt.emit('timeSecondChanged', second);
            alt.emit('timeChanged', time.hour, time.minute, time.second);
        },
        setWeatherForecast(weathers: Weathers[]) {
            const services = useServices().get('worldService');
            for (let service of services) {
                if (typeof service.setWeatherForecast !== 'function') {
                    continue;
                }

                service.setWeatherForecast(weathers);
            }

            alt.setMeta('serverWeatherForecast', weathers);
            alt.emit('weatherForecastChanged', weathers);
        },
        setWeather(weatherType: Weathers) {
            const services = useServices().get('worldService');
            for (let service of services) {
                if (typeof service.setWeather !== 'function') {
                    continue;
                }

                service.setWeather(weatherType);
            }

            alt.setMeta('serverWeather', weatherType);
            alt.emit('weatherChanged', weatherType);
        },
    };
}

alt.setMeta('serverTime', DEFAULT_TIME);
alt.setMeta('serverWeather', DEFAULT_WEATHER);
alt.setMeta('serverWeatherForecast', DEFAULT_WEATHER_FORECAST);
