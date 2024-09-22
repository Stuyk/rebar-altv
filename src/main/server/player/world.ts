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

    /**
     * Set to true to freeze the camera in its current place.
     * It's effectively like dropping a camera on the ground.
     *
     * @param {boolean} value
     * @return
     */
    function freezeCamera(value: boolean) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.controls.setCameraFrozen, value);
    }

    /**
     * Disable camera controls entirely, prevents looking around
     *
     * @param {boolean} value
     * @return
     */
    function disableCameraControls(value: boolean) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.controls.setCameraControlsDisabled, value);
    }

    /**
     * Disable attacking via shooting, punching, etc.
     * Also disabled weapon swapping.
     *
     * @param {boolean} value
     * @return
     */
    function disableAttackControls(value: boolean) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.controls.setAttackControlsDisabled, value);
    }

    function showPedOnScreen(position: 'left' | 'middle' | 'right') {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.screen.ped.show, true, position);
    }

    function hidePedOnScreen() {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.screen.ped.show, false);
    }

    async function getPointDetails(point: alt.Vector3): Promise<{
        streetName: string;
        zone: string;
        crossingRoad: string;
    }> {
        if (!player || !player.valid) {
            return undefined;
        }

        return await player.emitRpc(Events.systems.world.pointDetails, point);
    }

    async function getTravelDistance(point1: alt.Vector3, point2: alt.Vector3 = undefined): Promise<number> {
        if (!player || !player.valid) {
            return 0;
        }

        point2 = point2 ?? player.pos;
        const result = await player.emitRpc(Events.systems.world.travelDistance, point1, point2);
        return result;
    }

    return {
        clearAllScreenEffects,
        clearScreenBlur,
        clearScreenEffect,
        clearScreenFade,
        clearTimecycle,
        disableAttackControls,
        disableCameraControls,
        disableControls,
        enableControls,
        freezeCamera,
        hidePedOnScreen,
        setScreenBlur,
        setScreenEffect,
        setScreenFade,
        setTime,
        setTimecycle,
        setWeather,
        showPedOnScreen,
        getPointDetails,
        getTravelDistance,
    };
}
