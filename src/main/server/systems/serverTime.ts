import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

const time = {
    hour: 8,
    minute: 0,
    second: 0,
};

/**
 * Server time is the in-world time for the server and not real world time.
 *
 * @export
 * @return
 */
export function useServerTime() {
    /**
     * Set the in-game world time
     *
     * @param {number} value
     */
    function setHour(value: number) {
        if (value >= 24) {
            value = 0;
        }

        if (time.hour !== value) {
            RebarEvents.invoke('time-hour-changed', value);
            RebarEvents.invoke('time-changed', time.hour, time.minute, time.second);
        }

        time.hour = value;
    }

    /**
     * Set the in-game world minute
     *
     * @param {number} value
     */
    function setMinute(value: number) {
        if (value >= 60) {
            value = 0;
        }

        if (time.minute !== value) {
            RebarEvents.invoke('time-minute-changed', value);
            RebarEvents.invoke('time-changed', time.hour, time.minute, time.second);
        }

        time.minute = value;
    }

    /**
     * Set the in-game world second
     *
     * @param {number} value
     */
    function setSecond(value: number) {
        if (value >= 60) {
            value = 0;
        }

        if (time.minute !== value) {
            RebarEvents.invoke('time-second-changed', value);
            RebarEvents.invoke('time-changed', time.hour, time.minute, time.second);
        }

        time.second = value;
    }

    /**
     * Get the current in-game world time
     *
     * @return
     */
    function getTime() {
        return time;
    }

    return {
        getTime,
        setHour,
        setMinute,
        setSecond,
    };
}
