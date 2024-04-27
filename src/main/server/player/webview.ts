import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';

export function useWebview(player: alt.Player) {
    function emit(eventName: string, ...args: any[]) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.view.onServer, eventName, ...args);
    }

    return {
        emit,
    };
}
