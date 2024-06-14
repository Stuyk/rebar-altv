import alt from 'alt-client';
import native from 'natives';
import { Events } from '../../shared/events/index.js';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function handleCode(code: string) {
    new AsyncFunction('alt', 'native', 'natives', 'game', code)(alt, native, native, native);
}

if (alt.debug) {
    alt.onServer(Events.systems.transmitter.execute, handleCode);
}
