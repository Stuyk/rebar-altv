import { Events } from '../../src/main/shared/events';
import { useEvents } from './useEvents';

const events = useEvents();

let isInitialized = false;

export function useAudio() {
    if (!isInitialized) {
        isInitialized = true;
        events.on(Events.player.audio.play.local, play);
    }

    async function play(path: string) {
        const audio = new Audio(path);
        audio.loop = false;
        await audio.play();

        // this._audio[soundID] = new Audio(path);
        // this._audio[soundID].soundID = soundID;
        // this._audio[soundID].addEventListener('ended', this.audioStopped);
        // this._audio[soundID].crossOrigin = 'anonymous';
        // const ambientContext = new AudioContext();
        // const source = ambientContext.createMediaElementSource(this._audio[soundID]);
        // this._ambientPan[soundID] = ambientContext.createStereoPanner();
        // source.connect(this._ambientPan[soundID]);
        // this._ambientPan[soundID].connect(ambientContext.destination);
        // this._audio[soundID].setAttribute('src', path);
        // this._ambientPan[soundID].pan.value = pan;
    }

    return {
        play,
    };
}
