import { Weathers } from "@Shared/data/weathers.js";
import { useRebar } from "../index.js";

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

let currentWeather: Weathers = 'EXTRASUNNY';
let currentForecast: Weathers[] = [];

export function useServerWeather() {
    function set(weather: Weathers) {
        currentWeather = weather;
        RebarEvents.invoke('weather-changed', currentWeather);
    }

    function setForecast(weathers: Weathers[]) {
        currentForecast = weathers;
        RebarEvents.invoke('weather-forecast-changed', currentForecast);
    }

    function get() {
        return currentWeather;
    }

    function getForecast() {
        return currentForecast;
    }

    return {
        get,
        set,
        setForecast,
        getForecast
    }
}