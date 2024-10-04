import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';
import { Weathers } from '@Shared/data/weathers.js';

const DEFAULT_WEATHER: Weathers = 'EXTRASUNNY';
const DEFAULT_WEATHER_FORECAST: Weathers[] = ['EXTRASUNNY', 'CLOUDS', 'RAIN', 'THUNDER', 'CLOUDS', 'CLEARING'];

export interface WeatherService {
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
    setWeatherForecast: (types: Weathers[]) => void;
}

declare global {
    interface RebarServices {
        weatherService: WeatherService;
    }
}

declare module 'alt-server' {
    export interface ICustomGlobalMeta {
        serverWeather: Weathers;
        serverWeatherForecast: Weathers[];
    }

    export interface ICustomEmitEvent {
        'rebar:weatherForecastChanged': (weather: Weathers[]) => void;
        'rebar:weatherChanged': (weather: Weathers) => void;
    }
}

export function useWeatherService() {
    return {
        setWeatherForecast(weathers: Weathers[]) {
            const service = useServiceRegister().get('weatherService');

            alt.setMeta('serverWeatherForecast', weathers);
            alt.emit('rebar:weatherForecastChanged', weathers);

            if (service && service.setWeatherForecast) {
                service.setWeatherForecast(weathers);
            }
        },
        setWeather(weatherType: Weathers) {
            const service = useServiceRegister().get('weatherService');

            alt.setMeta('serverWeather', weatherType);
            alt.emit('rebar:weatherChanged', weatherType);

            if (service && service.setWeather) {
                service.setWeather(weatherType);
            }
        },
        getWeather() {
            return alt.getMeta('serverWeather');
        },
        getWeatherForecast() {
            return alt.getMeta('serverWeatherForecast');
        },
    };
}

alt.setMeta('serverWeather', DEFAULT_WEATHER);
alt.setMeta('serverWeatherForecast', DEFAULT_WEATHER_FORECAST);
