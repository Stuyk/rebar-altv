import { Events } from '../../src/main/shared/events';
import { useEvents } from './useEvents.js';

const events = useEvents();

let isInitialized = false;
let currentAudio: HTMLAudioElement | null = null;

export function useAudio() {
    if (!isInitialized) {
        isInitialized = true;
        events.on(Events.player.audio.play.local, play);
        events.on(Events.player.audio.stop.local, stop);
    }

    async function play(path: string, volume: number = 1) {
        stop();

        const audio = new Audio(path);
        audio.volume = volume;
        audio.loop = false;
        await audio.play();

        currentAudio = audio;

        audio.addEventListener('ended', () => {
            currentAudio = null;
        });
    }

    function stop() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    /**
     * Play a native frontend sound from the Webview
     *
     * @param {string} audioName
     * @param {string} audioRef
     * @return
     */
    async function playFrontend(audioName: string, audioRef: string, audioBank = '') {
        if (!('alt' in window)) {
            return;
        }

        alt.emit(Events.view.playFrontendSound, audioName, audioRef, audioBank);
    }

    return {
        play,
        playFrontend,
    };
}
