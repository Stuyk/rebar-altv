import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '../../shared/events/index.js';

function invoke(nativeName: string, ...args: any[]) {
    native[nativeName](...args);
}

alt.onServer(Events.player.native.invoke, invoke);
