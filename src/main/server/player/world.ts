import * as alt from 'alt-server';
import { useNative } from './native.js';
import { TimecycleTypes } from '@Shared/data/timecycleTypes.js';
import { ScreenEffects } from '@Shared/data/screenEffects.js';
import { Weathers } from '@Shared/data/weathers.js';
import { Events } from '../../shared/events/index.js';

export function useWorld(player: alt.Player) {
    const native = useNative(player);

    function setScreenBlur(timeInMs: number) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('triggerScreenblurFadeIn', timeInMs);
    }

    function clearScreenBlur(timeInMs: number) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('triggerScreenblurFadeOut', timeInMs);
    }

    function setScreenFade(timeInMs: number) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('doScreenFadeOut', timeInMs);
    }

    function clearScreenFade(timeInMs: number) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('doScreenFadeIn', timeInMs);
    }

    function setTimecycle(name: TimecycleTypes, timeInMs = -1) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('setTimecycleModifier', name);

        if (timeInMs >= 0) {
            alt.setTimeout(clearTimecycle, timeInMs);
        }
    }

    function clearTimecycle() {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('clearTimecycleModifier');
    }

    function setWeather(weather: Weathers, timeInSeconds: number) {
        if (!player || !player.valid) {
            return;
        }

        if (timeInSeconds > 1000) {
            timeInSeconds = timeInSeconds / 1000;
        }

        native.invoke('setWeatherTypeOvertimePersist', weather, timeInSeconds);
    }

    function setScreenEffect(effectName: ScreenEffects, duration: number, looped: boolean) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('animpostfxPlay', effectName, duration, looped);
    }

    function clearScreenEffect(effectName: ScreenEffects) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('animpostfxStop', effectName);
    }

    function clearAllScreenEffects() {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('animpostfxStopAll');
    }

    function setTime(hour: number, minute: number, second: number) {
        if (!player || !player.valid) {
            return;
        }

        native.invoke('pauseClock', false);
        if (hour >= 24) {
            hour = 23;
        }

        native.invoke('setClockTime', hour, minute, second);
        native.invoke('pauseClock', true);
    }

    function enableControls() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.controls.set, true);
    }

    function disableControls() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.controls.set, false);
    }

    return {
        clearAllScreenEffects,
        clearScreenBlur,
        clearScreenEffect,
        clearScreenFade,
        clearTimecycle,
        disableControls,
        enableControls,
        setScreenBlur,
        setScreenEffect,
        setScreenFade,
        setTime,
        setTimecycle,
        setWeather,
    };
}
