import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';

function setControls(state: boolean) {
    alt.toggleGameControls(state);
}

alt.onServer(Events.player.controls.set, setControls);
