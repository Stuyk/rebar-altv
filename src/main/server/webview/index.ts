import { Events } from '@Shared/events/index.js';
import * as alt from 'alt-server';

export function useWebview() {
    function emit(player: alt.Player, eventName: string, ...args: any[]) {
        player.emit(Events.view.onServer, eventName, ...args);
    }

    return {
        emit,
    };
}
